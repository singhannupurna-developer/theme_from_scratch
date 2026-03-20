class VariantPicker extends HTMLElement {
    constructor() {
        super();
        console.log('Hey');
    }
    connectedCallback(){
        this.VariantPicker=this.querySelector('select[name="id"]');
        this.VariantPicker.addEventListener('change',this.handleChange.bind('this'));
    }
    handleChange(){
        
    }
}
customElements.define('variant-picker',VariantPicker);