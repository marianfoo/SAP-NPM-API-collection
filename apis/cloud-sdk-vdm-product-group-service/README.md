# @sap/cloud-sdk-vdm-product-group-service

This package contains the OData VDM for the [Product Group Service](https://api.sap.com/api/API_PRODUCTGROUP_SRV) of SAP S/4HANA Cloud.
This service is part of the following communication scenarios: SAP Analytics Cloud for Planning Integration (SAP_COM_0087).
You can find additional documentation for this service on [help.sap.com](https://help.sap.com:00443/http.svc/ahp2/SAP_S4HANA_CLOUD/latest/EN/9e/784f0993264356b10ae4c6897204c0/frameset.htm).

## Usage Example
```
import { productGroupService } from '@sap/cloud-sdk-vdm-product-group-service';

const { productGroupApi } = productGroupService()
const resultPromise = productGroupApi.requestBuilder().getAll().top(5).execute({ destinationName:'myDestinationName' });

```

## Helpful Links

- [SAP Cloud SDK](https://github.com/SAP/cloud-sdk-js)
- [SAP Cloud SDK Documentation portal - Getting started guide](https://sap.github.io/cloud-sdk/docs/js/getting-started)
- [SAP Cloud SDK Documentation portal - API documentation](https://sap.github.io/cloud-sdk/docs/js/api)
- [developers.sap.com - Product Overview](https://developers.sap.com/topics/cloud-sdk.html)
- [developers.sap.com - Tutorials](https://developers.sap.com/tutorial-navigator.html?tag=software-product:technology-platform/sap-cloud-sdk&tag=tutorial:type/tutorial&tag=programming-tool:javascript)
- [Release notes](https://help.sap.com/doc/2324e9c3b28748a4ae2ad08166d77675/1.0/en-US/js-index.html)
- [SAP API Business Hub](https://api.sap.com/)
