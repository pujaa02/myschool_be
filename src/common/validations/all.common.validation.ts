export const commonFiles = {
  createPaymentTerm: {
    name: { require: true },
  },
  updatePaymentTerm: {
    name: { require: false },
    id: { require: true },
  },
  createCategory: {
    name: { require: true },
  },
  updateCategory: {
    name: { require: false },
    id: { require: true },
  },
  createCertificateTemplate: {
    certificate_template_id: { number: true, require: false, allow: [null] },
    is_legislation_included: { boolean: true },
    title: { require: false },
    note: { any: true },
    content: { require: false },
  },
  updateCertificateTemplate: {
    certificate_template_id: { require: false, number: true },
    title: { require: false },
    content: { require: false },
    note: { any: true },
    id: { require: true },
    is_legislation_included: { boolean: true },
  },
  createResources: {
    title: { require: true },
  },
  updateResources: {
    title: { require: false },
    id: { require: true },
  },
  createSubCategory: {
    name: { require: true },
  },
  updateSubCategory: {
    name: { require: false },
    id: { require: true },
  },
  createProject: {
    title: { require: true },
  },
  updateProject: { title: { require: false }, id: { require: true } },
  createProjectNote: {
    content: { require: true },
    project_id: { required: true },
  },
  updateProjectNote: { content: { require: false }, id: { require: true } },
  createQuote: {
    destination_goods: { require: true },
    address: { require: true },
  },
  updateQuote: { name: { require: false }, id: { require: true } },
  createCode: {
    description: { require: false },
  },
  updateCode: { id: { require: true }, description: { require: false } },
  createProjectFromQuote: { description: { require: false } },
  createAcademy: {
    name: { require: true },
    // address: { require: true },
  },
  updateAcademy: {
    name: { require: false },
    // address: { require: false },
    id: { require: true },
  },
};
