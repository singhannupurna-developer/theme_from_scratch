class CollectionFilters extends HTMLElement {
    constructor() {
        super();
        console.log('Filters Working');
    }

    getSectionId() {
        return (this.dataset.sectionId);
    }

    connectedCallback() {
        this.filterInputs = this.querySelectorAll('input');
        this.handleClick = this.handleClick.bind(this);
        this.filterInputs.forEach((input) => {
            input.addEventListener('change', this.handleClick);
        });

        // Fixing query selector for price range filter
        this.minRange = this.querySelector('input[type="range"][data-min-value]');
        this.maxRange = this.querySelector('input[type="range"][data-max-value]');
        this.FiltersTabs = Array.from(this.querySelectorAll("accordion-toggle"))
    }

    handleClick(event) {
        const input = event.currentTarget;
        let url;

        // If it's a regular filter (checkbox), use data-add-url and data-remove-url
        if (input.dataset.addUrl || input.dataset.removeUrl) {
            url = new URL(
                input.checked ? input.dataset.addUrl : input.dataset.removeUrl,
                window.location.origin
            );
        } else {
            // Handle the price range filter
            url = new URL(location.href);

            // Delete existing range values from the URL (to avoid duplicate parameters)
            url.searchParams.delete(this.minRange.dataset.param);
            url.searchParams.delete(this.maxRange.dataset.param);

            // Set the updated price range values
            url.searchParams.set(this.minRange.dataset.param, this.minRange.value);
            url.searchParams.set(this.maxRange.dataset.param, this.maxRange.value);
        }

        // Add section_id to the URL (if it's available)
        if (this.sectionId) {
            url.searchParams.set("section_id", this.sectionId);
        }

        // Perform the fetch to get the filtered content
        fetch(url.toString())
            .then((response) => response.text())
            .then((html) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const openFiltersTabs = this.FiltersTabs.map((value, index) => {
                    return (value.classList.contains("accordion--open") ? index : -1);
                }).filter((index) => {
                    return (index !== -1);
                })
                openFiltersTabs.forEach((index) => {
                    const currentFilter = 
                    tempDiv.querySelectorAll("accordion-toggle")[index];
                    currentFilter.classList.add("accordion--open");

                });
                const newContent = tempDiv.querySelector('.collection-section');
                const currentContent = document.querySelector('.collection-section');

                if (newContent && currentContent) {
                    currentContent.innerHTML = newContent.innerHTML;
                }

                // Remove section_id from the URL and update the browser history
                url.searchParams.delete("section_id");
                window.history.pushState({}, "", url.toString());
            })
            .catch((err) => {
                console.error('Filter fetch error:', err);
            });
    }
}

customElements.define('collection-filters', CollectionFilters);



//new toggle for accordion method

class AccordionToggle extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.header = this.querySelector(".accordion__header");
        this.content = this.querySelector(".accordion__content");

        this.handleClick = this.handleClick.bind(this);

        this.header.addEventListener("click", this.handleClick);

        this.addMaxHeight();
    }

    disconnectedCallback() {
        this.header.removeEventListener("click", this.handleClick);
    }

    handleClick() {
        if (this.classList.contains("accordion--open")) {
            this.classList.remove("accordion--open");
        } else {
            this.classList.add("accordion--open");
        }
    }

    addMaxHeight() {
        this.style.setProperty("--accordion-content-height", this.content.scrollHeight + "px");
    }
}

customElements.define("accordion-toggle", AccordionToggle);