/**
 * This child module is required to have the user's input to the 
 * dashboard and banner images and those have to be a part of course
 * (part of info property).
 * 
 * The bannerDashboardImages property is expecting to have these three options:
 *    1) default - This will just use Equella that houses all default banners and dashboard images.
 *    2) local - The user can enter the filepath to the folder that contains the images (required to be homeImage.jpg and dashboard.jpg)
 *    3) none - The teacher may already have a banner and dashboard images. This just skips the child module.
 * 
 * All work is handled inside uploadCanvas.js. Documentation can be found 
 * in github.com/byuitechops/upload-course-images.
 */

const util = require('util');
const canvas = require('canvas-wrapper');
const uploader = require('update-course-images');

const canvasGet = util.promisify(canvas.get);

//remove this and all conditionals that uses this variable when about to merge with the official transition tool.
const TESTING = true;

module.exports = (course, stepCallback) => {
   (async () => {
      if (TESTING) {
         course.info.bannerDashboardImages = {
            type: 'default',
            // fileLocation: '../test'
         }
      }

      /**
       * retrieveCourse
       * @param {Int} courseId
       * 
       * This function uses Daniel's Canvas wrapper to get the Canvas Course Object as an array.
       */
      async function retrieveCourse(courseId) {
         return await canvasGet(`/api/v1/courses/${courseId}`);
      }

      /**
       * handleDefault
       * 
       * This handles the job when the user provides default during the d2l-to-canvas conversion tool.
       */
      async function handleDefault() {
         try {
            let data = await retrieveCourse(course.info.canvasOU);

            if (TESTING) data[0].course_code = 'McGrath 101';

            let results = await uploader.beginUpload(data, true, true);

            course.log('Dashboard and homeImage Banner Child Module', {
               type: 'default',
               course_name: course.info.courseName,
               success: (results.badCourses.length < 1 ? true : false)
            });
         } catch (err) {
            course.error(err);
            stepCallback(null, course);
            return;
         }
      }

      /**
       * handleLocalFile
       * 
       * This handles the job when the user provides local during the d2l-to-canvas conversion tool.
       */
      async function handleLocalFile() {
         let fileLocation = course.info.bannerDashboardImages.fileLocation;

         if (!fileLocation) {
            course.error('fileLocation property of bannerDashboardImages property is not set');
            return;
         }

         let data = await retrieveCourse(course.info.canvasOU);

         if (TESTING) data[0].course_code = 'McGrath 101';

         let results = await uploader.beginUpload(data, false, true, fileLocation);

         course.log('Dashboard and homeImage Banner Child Module', {
            type: 'local',
            course_name: course.info.courseName,
            success: (results.badCourses.length < 1 ? true : false)
         });
      }

      /*********************************************************
       *********************** START HERE **********************
       *********************************************************/
      try {
         //checking the course object for what we need
         if (!course.info.bannerDashboardImages) {
            course.error(`Course object does not have bannerDashboardImages property.`);
            stepCallback(null, course);
         }

         switch (course.info.bannerDashboardImages.type) {
            case 'none':
               stepCallback(null, course);
               break;
            case 'local':
               await handleLocalFile();
               stepCallback(null, course);
               break;
            case 'default':
               await handleDefault();
               stepCallback(null, course);
               break;
            default:
               //should never happen but better safe than sorry.
               course.error('Invalid string for bannerDashboardImages property');
               stepCallback(null, course);
               return;
         }
      } catch (err) {
         course.error(err);
         stepCallback(null, course);
         return;
      }
   })();
};