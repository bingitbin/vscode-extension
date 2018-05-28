'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const shell = require('node-powershell');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let buildps = new shell({executionPolicy: 'Bypass',noProfile: true});
    let devps:any;
    let runDev = vscode.commands.registerCommand('extension.runDev', (uri) => {
        if (!(uri instanceof vscode.Uri)) {
            vscode.window.showWarningMessage('please select a folder!');
            return;
        }
        let path=uri.fsPath.replace(/\\/g,'\/');
        if(path.indexOf('/App/Pages/')<0)
        {
            vscode.window.showWarningMessage('must be under the Pages\'s subfolder!');
            return;
        }
        let pathItems=path.split('/');
        let fileName=pathItems[pathItems.length-1];
        let vueProjectDir=''
        let runName='';
        let page='';
        let tpl='';
        if(path.indexOf('/PC/')>-1)
        {
            runName='pc';
            vueProjectDir=path.substring(0,path.indexOf('/PC/'))
            if(path.indexOf('/Back/')>-1)
            {
                page=path.substring(path.indexOf('Back'))+'/'+fileName;
                tpl='pc.html';
            }
            else if(path.indexOf('/Front/')>-1){
                page=path.substring(path.indexOf('Front'))+'/'+fileName;
                tpl='pc_front.html';
            }
        }
        else{
            runName='mobile';
            vueProjectDir=path.substring(0,path.indexOf('/Mobile/'))
            page=path.substring(path.indexOf('Pages')+6)+'/'+fileName;
            tpl='mobile.html';
        }
        if(devps!=null)
        {
            devps.dispose();
        }
        devps = new shell({executionPolicy: 'Bypass',noProfile: true})

        devps.addCommand('Get-Process -Name node | Stop-Process')
        devps.addCommand(`cd ${vueProjectDir}`)
        devps.addCommand(`npm run dev-${runName} page ${page} tpl ${tpl}`)
        devps.invoke()
            .then((output:any) => {
                console.log('run complete');
                vscode.window.showInformationMessage('run complete!');
            })
            .catch((err:any) => {
                console.error(err);
            });
        vscode.window.showInformationMessage('run dev in few secend!');
    });

    let runBuild = vscode.commands.registerCommand('extension.runBuild', (uri) => {
        if (!(uri instanceof vscode.Uri)) {
            vscode.window.showWarningMessage('please select a folder!');
            return;
        }
        let path=uri.fsPath.replace(/\\/g,'\/');
        if(path.indexOf('/App/Pages/')<0)
        {
            vscode.window.showWarningMessage('must be under the Pages\'s subfolder!');
            return;
        }
        let pcIndex=path.indexOf('/PC/');
        let mobileIndex=path.indexOf('/Mobile/');
        let pathItems=path.split('/');
        let fileName=pathItems[pathItems.length-1];
        let page='';
        let vueProjectDir=''
        let runName='';
        if(pcIndex>-1)
        {
            runName='pc';
            vueProjectDir=path.substring(0,pcIndex)
            if(path.indexOf('/Back/')>-1)
            {
                page=path.substring(path.indexOf('Back'))+'/'+fileName;
            }
            else if(path.indexOf('/Front/')>-1){
                page=path.substring(path.indexOf('Front'))+'/'+fileName;
            }
        }
        else{
            runName='mobile';
            vueProjectDir=path.substring(0,mobileIndex)
            page=path.substring(path.indexOf('Pages')+6)+'/'+fileName;
        }
        buildps.addCommand(`cd ${vueProjectDir}`)
        buildps.addCommand(`npm run build-${runName} page ${page}`)
        buildps.invoke()
            .then((output:any) => {
                console.log('build complete');
                vscode.window.showInformationMessage('run ruild complete!');
            })
            .catch((err:any) => {
                console.error(err);
            });
        vscode.window.showInformationMessage('run build in few minues!');
    });

    let runBuildAll = vscode.commands.registerCommand('extension.runBuildAll', (uri) => {
        if (!(uri instanceof vscode.Uri)) {
            vscode.window.showWarningMessage('please select a folder!');
            return;
        }
        let path=uri.fsPath.replace(/\\/g,'\/');
        let pcIndex=path.indexOf('/PC/');
        let mobileIndex=path.indexOf('/Mobile/');
        if(pcIndex<0||mobileIndex<0)
        {
            vscode.window.showWarningMessage('must be under the PC or Mobile\'s subfolder!');
            return;
        }

        let vueProjectDir=''
        let runName='';
        if(pcIndex>-1)
        {
            runName='pc';
            vueProjectDir=path.substring(0,pcIndex)
        }
        else{
            runName='mobile';
            vueProjectDir=path.substring(0,mobileIndex)
        }
        buildps.addCommand(`cd ${vueProjectDir}`)
        buildps.addCommand(`npm run build-${runName}`)
        buildps.invoke()
            .then((output:any) => {
                console.log('build all complete');
                vscode.window.showInformationMessage('run ruild all complete!');
            })
            .catch((err:any) => {
                console.error(err);
            });
        vscode.window.showInformationMessage('run build all in few minues!');
    });

    context.subscriptions.push(runDev);
    context.subscriptions.push(runBuild);
    context.subscriptions.push(runBuildAll);
}

// this method is called when your extension is deactivated
export function deactivate() {
}