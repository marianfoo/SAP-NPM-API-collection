# @sap/cloud-sdk-vdm-service-transaction-item-category-service

This package contains the OData VDM for the Service Transaction Item Category Service of SAP S/4HANA Cloud.

## Usage Example
```
import { serviceTransactionItemCategoryService } from '@sap/cloud-sdk-vdm-service-transaction-item-category-service';

const { srvcDocumentItemCategoryApi } = serviceTransactionItemCategoryService()
const resultPromise = srvcDocumentItemCategoryApi.requestBuilder().getAll().top(5).execute({ destinationName:'myDestinationName' });

```

## Helpful Links

- [SAP Cloud SDK](https://github.com/SAP/cloud-sdk-js)
- [SAP Cloud SDK Documentation portal - Getting started guide](https://sap.github.io/cloud-sdk/docs/js/getting-started)
- [SAP Cloud SDK Documentation portal - API documentation](https://sap.github.io/cloud-sdk/docs/js/api)
- [developers.sap.com - Product Overview](https://developers.sap.com/topics/cloud-sdk.html)
- [developers.sap.com - Tutorials](https://developers.sap.com/tutorial-navigator.html?tag=software-product:technology-platform/sap-cloud-sdk&tag=tutorial:type/tutorial&tag=programming-tool:javascript)
- [Release notes](https://help.sap.com/doc/2324e9c3b28748a4ae2ad08166d77675/1.0/en-US/js-index.html)
- [SAP API Business Hub](https://api.sap.com/)
