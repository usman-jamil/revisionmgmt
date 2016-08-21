# Table of Contents
1. [Application Structure](#application-structure)
  * [Site Structure](#site-structure)
  * [Custom Lists](#custom-lists)
  * [Workflows](#workflows)
  * [Code Walk-Through](#code-walk-through)
3. [Credits](#credits)

# Revision Management

The revision management application manages revisions of flight reviews.

[Application Url](http://infospace.emirates.com/newsites/Demo/Lists/Revision%20Management/TEST.aspx)

> This application uses [d3](https://d3js.org/), [jquery](https://jquery.com/) as external components.

## Application Structure
### Site Structure
The Site structure contains only the main site. 
> The site is based on the **Team Site** template

### Custom Lists
  1. [Revision Management](src/ListTemplates/Revision%20Management.stp)  
    __Dependencies:__  
	* _MasterFleet_
	* _MasterManual_
	* _MasterChapter_
	* _MasterSection_
  2. [MasterFleet](src/ListTemplates/MasterFleet.stp)
  3. [MasterManual](src/ListTemplates/MasterManual.stp)  
    __Dependencies:__  
	* _MasterFleet_
  4. [MasterChapter](src/ListTemplates/MasterChapter.stp)  
    __Dependencies:__  
	* _MasterManual_
  5. [MasterSection](src/ListTemplates/MasterSection.stp)  
    __Dependencies:__  
	* _MasterChapter_

### Workflows
> Revision Management list has the **CommentWF** which run on *Item Updated* and *Item Added* events. This is designed using SharePoint designer. The purpose of the workflow is to Copy the comments from __Revision Management__ to __MasterChapter__ and __MasterSection__

### Code Walk-Through

The main component is the JS-Link based List View. Which has been added to the list using the following approach
 * Edit the list view web part
 * Expand Miscellaneous Section
 * Add the following in the JS Link property

   ```
   ~sitecollection/SiteAssets/RevMgmt/jquery-1.10.2.min.js|~sitecollection/SiteAssets/RevMgmt/d3.v3.min.js|~sitecollection/SiteAssets/RevMgmt/CollapsibleIndentedTree - BKP.js
   ```
   
Inorder to Use JS Link for rendering views, we need to override five key events:
 * OnPreRender

   ```javascript
   jslinkViews.AnnouncementAccordion.Templates = {};
   jslinkViews.AnnouncementAccordion.OnPreRender = jslinkTemplates.Announcements.Accordion.onPreRender;
   ```

* Templates.Header

   ```javascript
   jslinkViews.AnnouncementAccordion.Templates.Header = '<div class="accordion">';
   ```
   
* Templates.Item

   ```javascript
   jslinkViews.AnnouncementAccordion.Templates.Item = jslinkTemplates.Announcements.Accordion.item;
   ```   

* Templates.Footer

   ```javascript
   jslinkViews.AnnouncementAccordion.Templates.Footer = '</div>';
   ```
   
* OnPostRender

   ```javascript
   jslinkViews.AnnouncementAccordion.OnPostRender = jslinkTemplates.Announcements.Accordion.onPostRender;
   ```   

## Credits

**Shahnawaz Sarwar**

- <mailto:s716345@emirates.com>

**Muhammad Usman**