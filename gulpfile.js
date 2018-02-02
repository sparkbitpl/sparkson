const del = require("del");
const gulp = require("gulp");
const path = require("path");
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");


gulp.task("clean", () => {
    return del(["lib"]);
});

const tsProject = ts.createProject("tsconfig.json");

gulp.task("transpile-ts", () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write({
            includeContent: true,
            sourceRoot: function (file) {
                return path.relative(path.dirname(file.path), file.base);
            }
        }))
        .pipe(gulp.dest("lib"));
});

const dtsProject = ts.createProject("tsconfig.json", {declaration: true});

gulp.task("generate-dts", () => {
    const tsResult = dtsProject.src()
        .pipe(dtsProject());
    return tsResult.dts.pipe(gulp.dest("lib"));
});

gulp.task("build", (cb) =>
    runSequence("clean", "transpile-ts", "generate-dts", cb));