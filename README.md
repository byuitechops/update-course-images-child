# update-course-images
### *Package Name*: update-course-images-child
### *Child Type*: Post-Import
### *Platform*: All
### *Required*: Recommended

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose

Update the image that is on the home page and the course image (the one that gets displayed for the course in the Dashboard view in Canvas).

This is a child module version of the `update-course-images`. The standalone version that has more features and more documentation on how it works can be found [here](https://github.com/byuitechops/update-course-images). 

## How to Install

```sh
$ git clone https://github.com/byuitechops/update-course-images-child.git
$ cd update-course-image
$ npm i
$ ${Insert whatever your OS allows shown in below code snippet}
```

```sh
# Canvas requires an API token and we grab (will throw error if not there) it from the environment variables

# Powershell
$ $env:CANVAS_API_TOKEN="${INSERT YOUR CANVAS API TOKEN HERE}"

# cmd
$ set CANVAS_API_TOKEN=${INSERT YOUR CANVAS API TOKEN HERE}

# Linux and Mac
$ export CANVAS_API_TOKEN="${INSERT YOUR CANVAS API TOKEN HERE}"
```

## Run Requirements

This child module expects a property of the `course.info` object named `bannerDashboardImages`. This property
is a object that holds two values: type and fileLocation (only exist if the user chooses `local` and provide a filepath).

This child module requires that a large portion of the post-import child modules have already been executed.

## Process

In the end, the standalone version of this is being leveraged in this child module. Depending on the `course.info.bannerDashboardImages`, it'll provide different parameters to the `beginUpload` function inside the standalone version.

## Log Categories

List the categories used in logging data in your module.

- Dashboard and homeImage Banner Child module
   - Type: local | default --> What was executed inside the child module?
   - course_name: `<String>` --> What course was the child module executed on?
   - success: true | false --> Did the child module execute successfully?
