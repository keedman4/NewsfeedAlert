import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from 
'@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

//import styles from './NewsFeedAlertWebPart.module.scss';
import * as strings from 'NewsFeedAlertWebPartStrings';

import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

import {  
  SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions} from '@microsoft/sp-http';  

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
require('../../../node_modules/jquery/dist/jquery.js');



export interface INewsFeedAlertWebPartProps {
  Title: string;
  NewsAlert: string;
  lists: string | string[]; 
  Id: string;
  LastItemUserModifiedDate: string;
  ImageUrl: string;
  pagelink: URL;
  Created: Date;
  Modified: Date;
  Name: URL;
  Description: any; 
}

export default class NewsFeedAlertWebPart extends BaseClientSideWebPart <INewsFeedAlertWebPartProps> {
  
public render(): void {    
let listItems : string = "";
let spacer : string = this.domElement.innerHTML = `<span style="margin-right: 2rem;"></span> `;
this._getSharePointLists().then(lists => {
  
lists.forEach(list => {
//listItems += `${list.Title}`;
listItems = listItems + spacer + `${list.Title}` + spacer + `a<href="${list.Name}"></a>` //+ spacer  + `${list.Created}` + spacer + `${list.Modified}` + spacer + `${list.Description}`--> + spacer + ;
});
this.domElement.innerHTML = `
<div class="container-fluid">
<div class="row ">
  <div class="col-md-2" style="background-color:red; display: block;">
    <p style="padding-top:10px;font-size:15px;color:white; margin-left: 15px; width:100%; class="text-center"><i class='fas fa-bullhorn'></i>&nbsp;<span style="font-weight:700">ALERT</span></p>
  </div>
  <div class="col-md-10" style="background:RGB(245, 220, 220)">

<marquee>
 <p class="float-left" style="padding-top:9px;font-weight:700;"> ${listItems}</p>
 </marquee>

 </div>
</div>
</div>
`;
});
// this.domElement.innerHTML = `
// `;
}



private _getSharePointLists(): Promise<INewsFeedAlertWebPartProps[]> {

  
    const url: string = this.context.pageContext.web.absoluteUrl + "/_api/web/lists/getbytitle('Site Pages')/Items";
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
    .then(response => {
    return response.json();
    })
    .then(json => {
    return json.value;
    }) as Promise<INewsFeedAlertWebPartProps[]>;

    
    }

  protected get dataVersion(): Version {
  return Version.parse('1.0');
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              // PropertyPaneTextField('Title', {
              //   label: "HeadLine"
              // }),

              PropertyPaneTextField('NewsAlert', {
                label: "NewsFeed" ,
                multiline: true            
              }),

              PropertyFieldListPicker('lists', {
                label: 'Select a list or library',
                selectedList: this.properties.lists,
                includeHidden: false,
                orderBy: PropertyFieldListPickerOrderBy.Title,
                disabled: false,
                baseTemplate: 101,
                onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                properties: this.properties,
                context: this.context,
                onGetErrorMessage: null,
                deferredValidationTime: 0,
                key: 'listPickerFieldId'
              })
            ]
          }
        ]
      }
    ]
  };
}
}
//     <div class="${ styles.newsFeedAlert }">
// <div class="${ styles.container }">  
// <div class="${ styles.row }">
// <div class="${ styles.column}">  
//   <span class="${ styles.nbar}">
//   ALERT
//   </span>
//        <div class="${ styles.news }">  
//        <marquee direction="left" width="100%">
//   ${escape(this.properties.Title)}:  &nbsp; ${escape(this.properties.NewsAlert)}</marquee>
//   </div>
//      </div>
//        </div>
//        </div>
//       </div>