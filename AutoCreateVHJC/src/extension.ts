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
               return;
           }
           mkdir(path,callback,endIndex+1);
        })
    });


}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "AautoCreateVHJC" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    let addfile = vscode.commands.registerCommand('extension.addFile', (uri) => {
        // The code you place here will be executed every time your command is executed
        if (!(uri instanceof vscode.Uri)) {
            vscode.window.showInformationMessage('please select a folder!');
            return;
        }
        let path=uri.fsPath.replace(/\//g,'\\');
        let pathItems=path.split('\\');
        let fileName=pathItems[pathItems.length-1];
        let jsPath=`${path}\\${fileName}.js`;
        let htmlPath=`${path}\\${fileName}.html`;
        let cssPath=`${path}\\${fileName}.css`;
        let linkedVuePath=path.replace('App','_linkedvuefile');
        let vuePath=`${linkedVuePath}\\${fileName}.vue`;
        let relativeDirPath=path.substring(path.indexOf('App'));
        let backDirPath = relativeDirPath.split('\\').map(_=>'..').join('\\');
        let relativeLinkPath=`${backDirPath}\\${relativeDirPath}\\${fileName}`

        fs.exists(jsPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(jsPath, 'js', "utf8", () => {
                vscode.window.setStatusBarMessage('error', 5000);
            });
        });

        fs.exists(htmlPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(htmlPath, 'html', "utf8", () => {
                vscode.window.setStatusBarMessage('error', 5000);
            });
        });

        fs.exists(cssPath,(exists:boolean)=>{
            if(exists)
            {
               return;
            }
            fs.writeFile(cssPath, 'css', "utf8", () => {
                vscode.window.setStatusBarMessage('error', 5000);
            });
        });

        //d:\PC\App\Pages\V1\V\V.js

        mkdir(linkedVuePath,()=>{
            fs.exists(vuePath,(exists:boolean)=>{
                if(exists)
                {
                   return;
                }
                
                fs.writeFile(vuePath, `<template src="${relativeLinkPath}.html"></template><script src="${relativeLinkPath}.js"></script><style lang="scss" src="${relativeLinkPath}.scss" scoped></style>`, "utf8", () => {
                    vscode.window.setStatusBarMessage('error', 5000);
                });
            });
        });

      
        // ['c','cc'].forEach(_=>{
        //     path+='\\'+_;
        //     console.log(path);
        //     fs.exists(path,(exists:boolean)=>{
        //         if(exists)
        //         {
        //            return;
        //         }
        //         fs.mkdir(path,(err:Error)=>{
        //             console.log(err);
        //         })
        //     });
        // });
        
        console.log(uri);
        // Display a message box to the user
        vscode.window.showInformationMessage('extension.addfile!');
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(addfile);
}

// this method is called when your extension is deactivated
export function deactivate() {
}