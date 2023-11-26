import {App, MarkdownPostProcessorContext, Menu, Plugin, PluginSettingTab, Setting} from 'obsidian';
/*@ts-ignore*/
import GlslRender from 'glslCanvas';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
    mySetting: string;
    antialias: boolean;
    codeblock: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default',
    antialias: true,
    codeblock: 'glsl',
};

function parserGlsl(instance: MyPlugin):
    (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => void {
    return function (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        const preview = el.createEl('canvas');
        const sandbox = new GlslRender(preview);
        sandbox.on("error", (msg: Error) => {
        });
        sandbox.on("load", () => {
        });

        sandbox.load(source);
        sandbox.play();
        el.addEventListener('contextmenu', (event) => {
            const menu = new Menu()
                .addItem(item => {
                    item
                        .setTitle('Copy GLSL Source')
                        .setIcon('clipboard-copy')
                        .onClick(async () => {
                        });
                })
            ;
            menu.showAtMouseEvent(event);
        });
    };
}

export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    async onload() {
        await this.loadSettings();
        new SampleSettingTab(this.app, this);
        this.registerMarkdownCodeBlockProcessor(this.settings.codeblock, parserGlsl(this));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}


class SampleSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        plugin.addSettingTab(this);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        new Setting(containerEl)
            .setName('CodeBlockName')
            .setDesc('which block of need render')
            .addText(text => text
                .setPlaceholder('Enter your tag')
                .setValue(this.plugin.settings.codeblock)
                .onChange(async (value) => {
                    this.plugin.settings.codeblock = value;
                    await this.plugin.saveSettings();
                }));

    }
}
