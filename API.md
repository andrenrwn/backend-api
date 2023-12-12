[Back to README.md](README.md)

## API Reference

<dl>
<dt><a href="#GET /api/categories">GET /api/categories</a> ⇒ <code>ARRAY</code> | <code>JSON</code></dt>
<dd><p>Gets all categories, each including all its associated Products</p>
</dd>
<dt><a href="#GET /api/categories/_id">GET /api/categories/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Get one category, including its associated list of products</p>
</dd>
<dt><a href="#POST /api/categories">POST /api/categories</a> ⇒ <code>JSON</code> | <code>err</code></dt>
<dd><p>Create a new category in the database. A new category id is created if successful.</p>
</dd>
<dt><a href="#PUT /api/categories/_id">PUT /api/categories/:id</a> ⇒ <code>JSON</code> | <code>err</code></dt>
<dd><p>Update an exsting category, based on the specified category :id</p>
</dd>
<dt><a href="#DELETE /api/categories/_id">DELETE /api/categories/:id</a> ⇒ <code>JSON</code> | <code>err</code></dt>
<dd><p>Delete category entry specified by :id.</p>
</dd>
<dt><a href="#GET /api/products">GET /api/products</a> ⇒ <code>ARRAY</code> | <code>JSON</code></dt>
<dd><p>Gets all products, including their associated Category and Tag data</p>
</dd>
<dt><a href="#GET /api/products/_id">GET /api/products/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Get one product, including its associated Category and Tag data</p>
</dd>
<dt><a href="#POST /api/products">POST /api/products</a> ⇒ <code>Object</code></dt>
<dd><p>Create a new product in the database, including its associated Category and Tag data.</p>
</dd>
<dt><a href="#PUT /api/products/_id">PUT /api/products/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Update product, including its associated Category and Tag data. Tags data is updated after.</p>
</dd>
<dt><a href="#DELETE /api/products/_id">DELETE /api/products/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Delete product entry specified by :id.</p>
</dd>
<dt><a href="#GET /api/tags">GET /api/tags</a> ⇒ <code>ARRAY</code> | <code>JSON</code></dt>
<dd><p>Gets all tags, each including all its associated Products</p>
</dd>
<dt><a href="#GET /api/tags/_id">GET /api/tags/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Get one tag, including its associated list of products</p>
</dd>
<dt><a href="#POST /api/tags">POST /api/tags</a> ⇒ <code>JSON</code></dt>
<dd><p>Create a new category in the database. A new category id is created if successful.</p>
</dd>
<dt><a href="#PUT /api/tags/_id">PUT /api/tags/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Update an exsting category, based on the specified category :id</p>
</dd>
<dt><a href="#DELETE /api/tags/_id">DELETE /api/tags/:id</a> ⇒ <code>JSON</code></dt>
<dd><p>Delete tag entry specified by :id.</p>
</dd>
</dl>

<a name="GET /api/categories"></a>

## GET /api/categories ⇒ <code>ARRAY</code> \| <code>JSON</code>
Gets all categories, each including all its associated Products

**Kind**: global variable  
**Returns**: <code>ARRAY</code> \| <code>JSON</code> - array of all JSON categories objects including their products | error from sequelize if failed  
<a name="GET /api/categories/_id"></a>

## GET /api/categories/:id ⇒ <code>JSON</code>
Get one category, including its associated list of products

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON object literal of the specified category and its products | error in JSON from sequelize if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the category id (:id is specified at the end of the URI path) |

<a name="POST /api/categories"></a>

## POST /api/categories ⇒ <code>JSON</code> \| <code>err</code>
Create a new category in the database. A new category id is created if successful.

**Kind**: global variable  
**Returns**: <code>JSON</code> \| <code>err</code> - JSON object returning the newly created category { "id": "<newid>", "category_name": <new category name>" } | err message indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body must contain the following key/value pairs: |
| category_name | <code>STRING</code> | The new category name (must be unique in the database) |

<a name="PUT /api/categories/_id"></a>

## PUT /api/categories/:id ⇒ <code>JSON</code> \| <code>err</code>
Update an exsting category, based on the specified category :id

**Kind**: global variable  
**Returns**: <code>JSON</code> \| <code>err</code> - message indicating how many successful category entries were updated | err message indicating what went wrong from sequelize. 0 updated entries mean the entry was not updated.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the category id specified at the end of the URI path. ie. /api/categories/23 |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| category_name | <code>STRING</code> | The new updated category name (must be unique in the database) |

<a name="DELETE /api/categories/_id"></a>

## DELETE /api/categories/:id ⇒ <code>JSON</code> \| <code>err</code>
Delete category entry specified by :id.

**Kind**: global variable  
**Returns**: <code>JSON</code> \| <code>err</code> - message indicating how many successful categories were deleted | err message indicating what went wrong from sequelize. 0 deleted entries means no entry was deleted.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the category id specified at the end of the URI path. ie. /api/category/12 |

<a name="GET /api/products"></a>

## GET /api/products ⇒ <code>ARRAY</code> \| <code>JSON</code>
Gets all products, including their associated Category and Tag data

**Kind**: global variable  
**Returns**: <code>ARRAY</code> \| <code>JSON</code> - array of JSON objects of all products | error in JSON from sequelize if failed  
<a name="GET /api/products/_id"></a>

## GET /api/products/:id ⇒ <code>JSON</code>
Get one product, including its associated Category and Tag data

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON object literal of the specified product | error in JSON from sequelize if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the product id specified at the end of the URI path |

<a name="POST /api/products"></a>

## POST /api/products ⇒ <code>Object</code>
Create a new product in the database, including its associated Category and Tag data.

**Kind**: global variable  
**Returns**: <code>Object</code> - JSON object returning the newly created product {{ "id": "<newid>", "product_name": <new category name>", ... }, ARRAY } and ARRAY JSON tag objects that was created | error in JSON indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| product_name | <code>STRING</code> | The new product name (must be unique in the database) |
| price | <code>DECIMAL</code> | listed price of the product |
| stock | <code>INTEGER</code> | number of items left in stock |
| category_id | <code>INTEGER</code> | specifies the category identifier of the product |
| tagIds | <code>ARRAY</code> | An array of INTEGER tag IDs. ie. If a product has white (tag ID:1) and blue (tag ID: 5), it becomes: "tagId": [1,5] |

<a name="PUT /api/products/_id"></a>

## PUT /api/products/:id ⇒ <code>JSON</code>
Update product, including its associated Category and Tag data. Tags data is updated after.

**Kind**: global variable  
**Returns**: <code>JSON</code> - "message": indicating how many successful product and tag entries were updated | err message indicating what went wrong from sequelize.
                    0 updated entries mean no entry was not updated.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the product id specified at the end of the URI path. ie. /api/products/23 |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| product_name | <code>STRING</code> | The new product name (must be unique in the database) |
| price | <code>DECIMAL</code> | listed price of the product |
| stock | <code>INTEGER</code> | number of items left in stock |
| category_id | <code>INTEGER</code> | specifies the category identifier of the product |
| tagIds | <code>ARRAY</code> | An array of INTEGER tag IDs. ie. If a product has white (tag ID:1) and blue (tag ID: 5), it becomes: "tagId": [1,5] |

<a name="DELETE /api/products/_id"></a>

## DELETE /api/products/:id ⇒ <code>JSON</code>
Delete product entry specified by :id.

**Kind**: global variable  
**Returns**: <code>JSON</code> - "message": indicating how many successful product entries were deleted | err message indicating what went wrong from sequelize.
                0 deleted entries means no entry were deleted.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the product id specified at the end of the URI path. ie. /api/products/23 |

<a name="GET /api/tags"></a>

## GET /api/tags ⇒ <code>ARRAY</code> \| <code>JSON</code>
Gets all tags, each including all its associated Products

**Kind**: global variable  
**Returns**: <code>ARRAY</code> \| <code>JSON</code> - array of all JSON tag objects including their associated products | error from sequelize if failed  
<a name="GET /api/tags/_id"></a>

## GET /api/tags/:id ⇒ <code>JSON</code>
Get one tag, including its associated list of products

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON object literal of the specified tag and its products | error from sequelize if failed  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the tag id (:id is specified at the end of the URI path) |

<a name="POST /api/tags"></a>

## POST /api/tags ⇒ <code>JSON</code>
Create a new category in the database. A new category id is created if successful.

**Kind**: global variable  
**Returns**: <code>JSON</code> - JSON object returning the newly created tag { "id": "<newid>", "tag_name": <new tag name>" } | err message indicating what went wrong from sequelize  

| Param | Type | Description |
| --- | --- | --- |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body must contain the following key/value pairs: |
| tag_name | <code>STRING</code> | The new tag name (must be unique in the database) |

<a name="PUT /api/tags/_id"></a>

## PUT /api/tags/:id ⇒ <code>JSON</code>
Update an exsting category, based on the specified category :id

**Kind**: global variable  
**Returns**: <code>JSON</code> - "message": indicating how many successful tag entries were updated | err message indicating what went wrong from sequelize. 0 updated entries mean the entry was not updated.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the tag id specified at the end of the URI path. ie. /api/tags/23 |
| req.body | <code>JSON</code> | JSON object literals in the POST HTTP body containing the following key/value pairs: |
| tag_name | <code>STRING</code> | The new updated tag name (must be unique in the database) |

<a name="DELETE /api/tags/_id"></a>

## DELETE /api/tags/:id ⇒ <code>JSON</code>
Delete tag entry specified by :id.

**Kind**: global variable  
**Returns**: <code>JSON</code> - "message": indicating how many successful tag entries were deleted | err message indicating what went wrong from sequelize. 0 deleted entries means no entry was deleted.  

| Param | Type | Description |
| --- | --- | --- |
| :id | <code>INTEGER</code> | is the tag id specified at the end of the URI path. ie. /api/tags/12 |

