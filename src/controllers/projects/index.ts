import { exec } from "controllers/common/index";
import { isFileExist, getGitLogs, formatDay, screenLoading } from "utils/index";
import { ElMessage } from "element-plus";
import { remote } from "electron";
// import { WriteMarkdown } from "@/utils/markdown";

import { gitLog, gitLog2Markdown } from "utils/git"
const { dirname, extname, join } = require("path");
const { remote: { dialog } } = require('electron')
const fs = require("fs");
export function npmInstall() {
    //todo
}
export function openInEdit(src) {
    return exec({
        command: `code "${src}"`,
    });
}
export function openInExplore(src: string) {
    //if it's file. open its folder
    const folderUrl = extname(src) ? dirname(src) : src;
    return exec({
        command: `explorer "${folderUrl}"`,
    });
}
export function openInGithub(src) {
    const url = join(src, ".git", "config");
    if (!isFileExist(url)) return ElMessage.error("该项目未被git托管");
    const config = fs.readFileSync(url).toString();
    const target = config.match(/((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/)[0];
    if (target) {
        return exec({
            command: `explorer "${target}"`,
        });
        // shell.openExternal(target)
    } else {
        ElMessage.error("找不到这个项目的git地址啊");
    }
}
export function reloadData(src) {
    //todo
}
export async function createDailyReport(src) {
    const closeLoading = screenLoading()
    const gitlog = gitLog(src, "day")
    const conetnt = gitLog2Markdown(gitlog, "日报")
    dialog.showSaveDialog({
        title: '保存周报',
        buttonLabel: '保存',
        defaultPath: join(remote.app.getPath("desktop"), "/DailyReport.md"),
        filters: [{ name: 'markdown', extensions: ['md'] }]
    }).then(({ canceled, filePath }) => {
        !canceled && fs.writeFileSync(filePath, conetnt)
        closeLoading()
    })
}
export function createWeeklyReport(src) {
    const closeLoading = screenLoading()
    const gitlog = gitLog(src, "week")
    const conetnt = gitLog2Markdown(gitlog, "周报")
    console.log(conetnt)
    dialog.showSaveDialog({
        title: '保存周报',
        buttonLabel: '保存',
        defaultPath: join(remote.app.getPath("desktop"), "/WeeklyReport.md"),
        filters: [{ name: 'markdown', extensions: ['md'] }]
    }).then(({ canceled, filePath }) => {
        !canceled && fs.writeFileSync(filePath, conetnt)
        closeLoading()
    })
}
export function editProject(src) {
    //todo
}
export function deleteProject(src) {
    //todo
}
export function runScript(src, script) {
    const command = `start /i/high npm run ${script}`;
    const options = { cwd: src, detached: true };
    return exec({ command, options, autoCloseLoading: 1000 });
}
export default {
    npmInstall,
    openInEdit,
    openInExplore,
    openInGithub,
    reloadData,
    createDailyReport,
    createWeeklyReport,
    editProject,
    deleteProject,
};
