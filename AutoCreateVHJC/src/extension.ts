'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
//const fpath = require('path')

function mkdir(path:string,callback:Function,index?:number){
    let theIndex=index||0;
    let endIndex=path.indexOf('\\',theIndex);
    if(endIndex==-1)
    {
        if(theIndex<path.length)
        {
            endIndex=path.length;
        }
        else{
            callback&&callback();
            return;
        }
    }
    
    let thePath=path.substring(0,endIndex)
    
    fs.exists(thePath,(exists:boolean)=>{
        if(exists)
        {
           mkdir(path,callback,endIndex+1);
           return;
        }
        fs.mkdir(thePath,(err:Error)=>{
           if(err)
           {
               vscode.window.showErrorMessage(err.message);
               return;
           }
           mkdir(path,callback,endIndex+1);
        })
    });


}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let addfile = vscode.commands.registerCommand('extension.addFile', (uri) => {
        // The code you place here will be executed every time your command is executed
        if (!(uri instanceof vscode.Uri)) {
            vscode.window.showWarningMessage('please select a folder!');
            return;
        }

        let path=uri.fsPath.replace(/\//g,'\\');

        if(path.indexOf('\\App\\')<0)
        {
            vscode.window.showWarningMessage('must be under the app\'s subfolder!');
            return;
        }

        let pathItems=path.split('\\');
        let fileName=pathItems[pathItems.length-1];
        let jsPath=`${path}\\${fileName}.js`;
        let htmlPath=`${path}\\${fileName}.html`;
        let cssPath=`${path}\\${fileName}.scss`;
        let linkedVuePath=path.replace('App','linkedvuefile');
        //路径不一致
        linkedVuePath=linkedVuePath.substring(0,linkedVuePath.lastIndexOf('\\'+fileName));
        let vuePath=`${linkedVuePath}\\${fileName}.vue`;
        let relativeDirPath=path.substring(path.indexOf('App'));
        //路径不一致
        let relativeVueDirPath=linkedVuePath.substring(linkedVuePath.indexOf('linkedvuefile'));
        //let backDirPath = relativeDirPath.split('\\').map(_=>'..').join('\\');
        //路径不一致
        let backDirPath = relativeVueDirPath.split('\\').map(_=>'..').join('\\');
        let relativeLinkPath=`${backDirPath}\\${relativeDirPath}\\${fileName}`



        fs.exists(jsPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(jsPath, 'export default {\n\tdata(){\n\t\treturn{}\n\t},\n\tcreated(){\n\t},\n\tmethods:{\n\t},\n\tcomponents:{\n\t}\n}', "utf8", (err:Error) => {
                err&&vscode.window.showErrorMessage(err.message);
            });
        });

        fs.exists(htmlPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(htmlPath, '<div>\n</div>', "utf8", (err:Error) => {
                err&&vscode.window.showErrorMessage(err.message);
            });
        });

        fs.exists(cssPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(cssPath, '', "utf8", (err:Error) => {
                err&&vscode.window.showErrorMessage(err.message);
            });
        });

        mkdir(linkedVuePath,()=>{
            fs.exists(vuePath,(exists:boolean)=>{
                if(exists)
                {
                   return;
                }
                
                fs.writeFile(vuePath, `<template src="${relativeLinkPath}.html"></template><script src="${relativeLinkPath}.js"></script><style lang="scss" src="${relativeLinkPath}.scss" scoped></style>`, "utf8", (err:Error) => {
                    if(err){
                        vscode.window.showErrorMessage(err.message);
                        return;
                    }
                    vscode.window.showInformationMessage('created successfully!');
                });
            });
        });
    });
    context.subscriptions.push(addfile);
}

// this method is called when your extension is deactivated
export function deactivate() {
}