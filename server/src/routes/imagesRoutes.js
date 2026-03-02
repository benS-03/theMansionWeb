const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin')

/**
 * ------------------------------------------------------------
 * Description:
 *     Route used to get a presinged URL for s3 image upload
 *     **NOT IMPLEmENTED YET**
 *
 * Route:
 *     POST /presign
 *
 * Route Params:
 *     none
 *
 * Query Params:
 *     none
 *
 * Request Body:
 *     JSON contianing filename and filetype
 *
 * Returns:
 *     JSON containing upload URL
 *
 * Errors:
 *     500 - All Errors
 * ------------------------------------------------------------
 */
router.post('/presign', ensureAdmin, (req, res) => {

})