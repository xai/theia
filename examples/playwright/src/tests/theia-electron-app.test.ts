// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import { expect, test } from '@playwright/test';
import { TheiaExplorerView } from '../theia-explorer-view';
import { TheiaAboutDialog } from '../theia-about-dialog';
import { ElectronLaunchOptions, TheiaElectronAppLoader } from '../theia-app-loader';
import { TheiaWorkspace } from '../theia-workspace';
import { TheiaApp } from '../theia-app';

test.describe('Theia Electron Application', () => {

    let ws: TheiaWorkspace;
    let app: TheiaApp;

    test.beforeAll(async () => {
        ws = new TheiaWorkspace(['src/tests/resources/sample-files1']);
        app = await TheiaElectronAppLoader.load(new ElectronLaunchOptions('../electron', '../../plugins'), ws);
    });

    test('should load and show main content panel', async () => {
        expect(await app.isMainContentPanelVisible()).toBe(true);
    });

    test('open about dialog using menu', async () => {
        // open about dialog using menu
        await (await app.menuBar.openMenu('Help')).clickMenuItem('About');
        const aboutDialog = new TheiaAboutDialog(app);
        expect(await aboutDialog.isVisible()).toBe(true);
        await aboutDialog.close();
        expect(await aboutDialog.isVisible()).toBe(false);
    });

    test('toggle explorer view using menu', async () => {
        await (await app.menuBar.openMenu('View')).clickMenuItem('Explorer');
        const explorerView = new TheiaExplorerView(app);
        expect(await explorerView.isDisplayed()).toBe(true);
        await (await app.menuBar.openMenu('View')).clickMenuItem('Explorer');
        expect(await explorerView.isDisplayed()).toBe(false);
    });

    test('open quick command palette', async () => {
        const quickCommand = app.quickCommandPalette;
        expect(await quickCommand.isOpen()).toBe(false);
        await quickCommand.open();
        expect(await quickCommand.isOpen()).toBe(true);
    });

    test('open about dialog using command', async () => {
        const quickCommand = app.quickCommandPalette;
        await quickCommand.open();
        await quickCommand.type('About');
        await quickCommand.trigger('About');
        const aboutDialog = new TheiaAboutDialog(app);
        expect(await quickCommand.isOpen()).toBe(false);
        expect(await aboutDialog.isVisible()).toBe(true);
        await aboutDialog.close();
    });

    test('select all using command', async () => {
        const quickCommand = app.quickCommandPalette;
        await quickCommand.type('Select All');
        await quickCommand.trigger('Select All');
        expect(await quickCommand.isOpen()).toBe(false);
    });

    test('toggle explorer view using command', async () => {
        const quickCommand = app.quickCommandPalette;
        const explorerView = new TheiaExplorerView(app);
        await quickCommand.open();
        await quickCommand.type('Toggle Explorer');
        await quickCommand.trigger('Toggle Explorer View');
        expect(await quickCommand.isOpen()).toBe(false);
        expect(await explorerView.isDisplayed()).toBe(true);
    });
});

