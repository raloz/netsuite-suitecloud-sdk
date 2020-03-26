/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.  All rights reserved.
 ** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
'use strict';

const BaseCommandGenerator = require('./BaseCommandGenerator');
const CommandUtils = require('../utils/CommandUtils');
const {executeWithSpinner} = require('../ui/CliSpinner');
const NodeUtils = require('../utils/NodeUtils');
const assert = require('assert');
const ProjectInfoService = require('../services/ProjectInfoService');

const {PROJECT_SUITEAPP} = require('../ApplicationConstants');

module.exports = class PublishCommandGenerator extends BaseCommandGenerator {
    constructor(options) {
        super(options);
        this._projectInfoService = new ProjectInfoService(this._projectFolder);
        this._projectType = this._projectInfoService.getProjectType();
    }

    async _getCommandQuestions(prompt) {
        const isSuiteAppProject = this._projectType === PROJECT_SUITEAPP;
        if (!isSuiteAppProject) {
            throw 'This command can only be used for SuiteApp projects';
        }

        return await prompt([
            {
                type: CommandUtils.INQUIRER_TYPES.LIST,
                name: 'nsversion',
                message: "What is the minimal required NetSuite version for this SuiteApp",
                choices: [
                    '2020.1',
                    '2020.2'
                ]
            },
            {
                type: CommandUtils.INQUIRER_TYPES.LIST,
                name: 'phasing',
                message: 'What is your SuiteApp phase',
                choices: [
                    'Leading',
                    'Lagging'
                ]
            },
        ]);
    }

    async _executeAction(answers) {
        const nsVersion = answers['nsversion'];
        const phasing = answers['phasing'];

        const actionResult = {
            nsVersion: nsVersion,
            phasing: phasing,
        };

        await executeWithSpinner({
            action: new Promise((resolve, reject) => setTimeout(() => resolve(), 5000)),
            message: 'Validating project...',
        });

        await executeWithSpinner({
            action: new Promise((resolve, reject) => setTimeout(() => resolve(), 3000)),
            message: 'Packaging project...',
        });

        await executeWithSpinner({
            action: new Promise((resolve, reject) => setTimeout(() => resolve(), 5000)),
            message: 'Uploading project to SuiteApp control center...',
        });

        return Promise.resolve(actionResult);
    }

    _formatOutput(actionResult) {
        const {} = actionResult;

        const version = this._projectInfoService.getProjectVersion();
        const appId = this._projectInfoService.getApplicationId();

        NodeUtils.println(
            `SuiteApp with application ID: ${appId} and version: ${version} has been successfully uploaded to control center.`,
            NodeUtils.COLORS.INFO
        );
    }

};
