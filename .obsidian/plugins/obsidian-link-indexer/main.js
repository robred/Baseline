'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var LinkIndexer = /** @class */ (function (_super) {
    __extends(LinkIndexer, _super);
    function LinkIndexer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkIndexer.prototype.onInit = function () { };
    LinkIndexer.prototype.onload = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var loadedSettings;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadData()];
                    case 1:
                        loadedSettings = _b.sent();
                        if (loadedSettings) {
                            this.settings = cjs(new LinkIndexerSettings(), loadedSettings);
                            this.settings.usedLinks = [];
                            (_a = loadedSettings.usedLinks) === null || _a === void 0 ? void 0 : _a.forEach(function (r) {
                                _this.settings.usedLinks.push(cjs(new UsedLinks(), r));
                            });
                        }
                        else {
                            this.settings = new LinkIndexerSettings();
                        }
                        this.reloadSettings();
                        this.addSettingTab(new LinkIndexerSettingTab(this.app, this));
                        return [2 /*return*/];
                }
            });
        });
    };
    LinkIndexer.prototype.onunload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.saveData(this.settings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LinkIndexer.prototype.reloadSettings = function () {
        var _this = this;
        this.removeOwnCommands();
        this.settings.usedLinks.forEach(function (r) {
            _this.addCommand({
                id: "link-indexer:used-links:" + r.name,
                name: "Used links - " + r.name,
                callback: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.generateAllUsedLinksIndex(getPresetByName(this.settings.usedLinks, r.name))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); },
            });
        });
    };
    LinkIndexer.prototype.removeOwnCommands = function () {
        var _this = this;
        // @ts-ignore
        this.app.commands.listCommands().map(function (c) { return c.id; }).filter(function (c) { return c.startsWith(_this.manifest.id); }).forEach(function (c) {
            // @ts-ignore
            _this.app.commands.removeCommand(c);
        });
    };
    LinkIndexer.prototype.generateAllUsedLinksIndex = function (preset) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueLinks, files, sortedLinks, separator, content, exist, p;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!preset) {
                            return [2 /*return*/, new obsidian.Notice(preset + " was not found. Try reloading Obsidian.")];
                        }
                        uniqueLinks = {};
                        files = this.app.vault.getMarkdownFiles();
                        files.forEach(function (f) {
                            if (_this.isExcludedFrom(f))
                                return;
                            _this.grabLinks(uniqueLinks, f, _this.app.metadataCache.getFileCache(f).links, preset);
                            if (preset.includeEmbeds) {
                                _this.grabLinks(uniqueLinks, f, _this.app.metadataCache.getFileCache(f).embeds, preset);
                            }
                        });
                        sortedLinks = Object.entries(uniqueLinks).sort(function (a, b) { return b[1].count - a[1].count; });
                        separator = preset.strictLineBreaks ? '\n\n' : '\n';
                        content = sortedLinks.map(function (l) { return l[1].count + " " + l[1].link; }).join(separator);
                        return [4 /*yield*/, this.app.vault.adapter.exists(obsidian.normalizePath(preset.path), false)];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            p = this.app.vault.getAbstractFileByPath(obsidian.normalizePath(preset.path));
                            this.app.vault.adapter.write(obsidian.normalizePath(preset.path), content);
                        }
                        else {
                            this.app.vault.create(preset.path, content);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LinkIndexer.prototype.isExcludedFrom = function (f) {
        return this.settings.usedLinks.map(function (r) { return r.path; }).includes(f.path);
    };
    LinkIndexer.prototype.grabLinks = function (uniqueLinks, f, links, preset) {
        var _this = this;
        links === null || links === void 0 ? void 0 : links.forEach(function (l) {
            var link = obsidian.getLinkpath(l.link);
            var originFile = _this.app.metadataCache.getFirstLinkpathDest(link, f.path);
            if (preset.nonexistentOnly && originFile) {
                return;
            }
            var origin = originFile ? originFile.path : link;
            if (uniqueLinks[origin]) {
                uniqueLinks[origin].count += 1;
            }
            else {
                var rawLink = originFile ? _this.app.metadataCache.fileToLinktext(originFile, preset.path, true) : link;
                uniqueLinks[origin] = {
                    count: 1,
                    link: preset.linkToFiles ? "[[" + rawLink + "]]" : rawLink
                };
            }
        });
    };
    return LinkIndexer;
}(obsidian.Plugin));
var UsedLinks = /** @class */ (function () {
    function UsedLinks() {
        this.strictLineBreaks = true;
        this.includeEmbeds = true;
        this.linkToFiles = true;
        this.nonexistentOnly = false;
        this.name = Date.now().toString();
        this.path = "./used_links" + this.name + ".md";
    }
    return UsedLinks;
}());
var LinkIndexerSettings = /** @class */ (function () {
    function LinkIndexerSettings() {
        this.usedLinks = [];
    }
    return LinkIndexerSettings;
}());
function getPresetByName(presets, name) {
    return presets.find(function (r) { return r.name === name; });
}
var LinkIndexerSettingTab = /** @class */ (function (_super) {
    __extends(LinkIndexerSettingTab, _super);
    function LinkIndexerSettingTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkIndexerSettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Used links' });
        plugin.settings.usedLinks.forEach(function (report) {
            new obsidian.Setting(containerEl)
                .setName('Preset name')
                .setDesc('Allowed characters: ASCII letters, digits, underscores, spaces')
                .addText(function (text) {
                return text.setPlaceholder(report.name)
                    .setPlaceholder(report.name)
                    .setValue(report.name)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.name = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            new obsidian.Setting(containerEl)
                .setName('All used links')
                .setDesc('Path to the note that will contain all found links sorted by their occurrences')
                .addText(function (text) {
                return text
                    .setPlaceholder(report.path)
                    .setValue(report.path)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.path = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            new obsidian.Setting(containerEl)
                .setName('Include embeds')
                .setDesc('When disabled, only direct links are counted. Enable to include embedded (trascluded) links.')
                .addToggle(function (value) {
                return value
                    .setValue(report.includeEmbeds)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.includeEmbeds = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            new obsidian.Setting(containerEl)
                .setName('Nonexistent files only')
                .setDesc('When disabled, links to both existing and nonexisting files are counted.')
                .addToggle(function (value) {
                return value
                    .setValue(report.nonexistentOnly)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.nonexistentOnly = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            new obsidian.Setting(containerEl)
                .setName('Strict line breaks')
                .setDesc('Corresponds to the same Editor setting: "off" = one line break, "on" = two line breaks.')
                .addToggle(function (value) {
                return value
                    .setValue(report.strictLineBreaks)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.strictLineBreaks = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            new obsidian.Setting(containerEl)
                .setName('Link to files')
                .setDesc('When "on" the output file will use wiki-links to files. Disable if you don\'t want to pollute graph with it.')
                .addToggle(function (value) {
                return value
                    .setValue(report.linkToFiles)
                    .onChange(function (value) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                report.linkToFiles = value;
                                return [4 /*yield*/, this.saveData({ refreshUI: false })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            var deleteButton = new obsidian.Setting(containerEl).addButton(function (extra) {
                return extra.setButtonText('Delete preset').onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                    var index;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                index = plugin.settings.usedLinks.findIndex(function (r) { return r.name === report.name; });
                                if (!(index > -1)) return [3 /*break*/, 2];
                                plugin.settings.usedLinks.splice(index, 1);
                                return [4 /*yield*/, this.saveData()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            });
            deleteButton.settingEl.style.borderBottom = '1px solid var(--text-accent)';
        });
        var addButton = new obsidian.Setting(containerEl).addButton(function (button) {
            return button.setButtonText('Add preset').onClick(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            plugin.settings.usedLinks.push(new UsedLinks());
                            return [4 /*yield*/, this.saveData()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        addButton.infoEl.remove();
        addButton.settingEl.style.justifyContent = 'center';
    };
    LinkIndexerSettingTab.prototype.saveData = function (options) {
        if (options === void 0) { options = { refreshUI: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var plugin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plugin = this.plugin;
                        return [4 /*yield*/, plugin.saveData(plugin.settings)];
                    case 1:
                        _a.sent();
                        plugin.reloadSettings();
                        if (options.refreshUI)
                            this.display();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LinkIndexerSettingTab;
}(obsidian.PluginSettingTab));

module.exports = LinkIndexer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9kZWVwbWVyZ2UvZGlzdC9janMuanMiLCJzcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBvKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIHApKSBfX2NyZWF0ZUJpbmRpbmcobywgbSwgcCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICBpZiAobyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IocyA/IFwiT2JqZWN0IGlzIG5vdCBpdGVyYWJsZS5cIiA6IFwiU3ltYm9sLml0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc01lcmdlYWJsZU9iamVjdCA9IGZ1bmN0aW9uIGlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpXG5cdFx0JiYgIWlzU3BlY2lhbCh2YWx1ZSlcbn07XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuXHR2YXIgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuXG5cdHJldHVybiBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXSdcblx0XHR8fCBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgRGF0ZV0nXG5cdFx0fHwgaXNSZWFjdEVsZW1lbnQodmFsdWUpXG59XG5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi9iNWFjOTYzZmI3OTFkMTI5OGU3ZjM5NjIzNjM4M2JjOTU1ZjkxNmMxL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxLUwyNVxudmFyIGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBjYW5Vc2VTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG5cbmZ1bmN0aW9uIGVtcHR5VGFyZ2V0KHZhbCkge1xuXHRyZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gKG9wdGlvbnMuY2xvbmUgIT09IGZhbHNlICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodmFsdWUpKVxuXHRcdD8gZGVlcG1lcmdlKGVtcHR5VGFyZ2V0KHZhbHVlKSwgdmFsdWUsIG9wdGlvbnMpXG5cdFx0OiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuXHRyZXR1cm4gdGFyZ2V0LmNvbmNhdChzb3VyY2UpLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKGVsZW1lbnQsIG9wdGlvbnMpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG5cdGlmICghb3B0aW9ucy5jdXN0b21NZXJnZSkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2Vcblx0fVxuXHR2YXIgY3VzdG9tTWVyZ2UgPSBvcHRpb25zLmN1c3RvbU1lcmdlKGtleSk7XG5cdHJldHVybiB0eXBlb2YgY3VzdG9tTWVyZ2UgPT09ICdmdW5jdGlvbicgPyBjdXN0b21NZXJnZSA6IGRlZXBtZXJnZVxufVxuXG5mdW5jdGlvbiBnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc1xuXHRcdD8gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpLmZpbHRlcihmdW5jdGlvbihzeW1ib2wpIHtcblx0XHRcdHJldHVybiB0YXJnZXQucHJvcGVydHlJc0VudW1lcmFibGUoc3ltYm9sKVxuXHRcdH0pXG5cdFx0OiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHR0cnkge1xuXHRcdHJldHVybiBwcm9wZXJ0eSBpbiBvYmplY3Rcblx0fSBjYXRjaChfKSB7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcblx0cmV0dXJuIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuXHRcdCYmICEoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG5cdFx0XHQmJiBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSkpIC8vIGFuZCBhbHNvIHVuc2FmZSBpZiB0aGV5J3JlIG5vbmVudW1lcmFibGUuXG59XG5cbmZ1bmN0aW9uIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHZhciBkZXN0aW5hdGlvbiA9IHt9O1xuXHRpZiAob3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSB7XG5cdFx0Z2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuXHRcdH0pO1xuXHR9XG5cdGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0aWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZGVzdGluYXRpb25cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2U7XG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGlzTWVyZ2VhYmxlT2JqZWN0O1xuXHQvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG5cdC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cblx0b3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkO1xuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpO1xuXHR2YXIgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcblx0dmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59O1xuXG52YXIgZGVlcG1lcmdlXzEgPSBkZWVwbWVyZ2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXzE7XG4iLCJpbXBvcnQgZGVlcG1lcmdlIGZyb20gJ2RlZXBtZXJnZSc7XHJcbmltcG9ydCB7IFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVmF1bHQsIG5vcm1hbGl6ZVBhdGgsIFRGaWxlLCBnZXRMaW5rcGF0aCwgUmVmZXJlbmNlQ2FjaGUsIE5vdGljZSB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmludGVyZmFjZSBJbmRleE5vZGUge1xyXG4gIGNvdW50OiBudW1iZXI7XHJcbiAgbGluazogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rSW5kZXhlciBleHRlbmRzIFBsdWdpbiB7XHJcbiAgc2V0dGluZ3M6IExpbmtJbmRleGVyU2V0dGluZ3M7XHJcbiAgdmF1bHQ6IFZhdWx0O1xyXG5cclxuICBvbkluaXQoKSB7fVxyXG5cclxuICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICBjb25zdCBsb2FkZWRTZXR0aW5ncyA9IGF3YWl0IHRoaXMubG9hZERhdGEoKTtcclxuICAgIGlmIChsb2FkZWRTZXR0aW5ncykge1xyXG4gICAgICB0aGlzLnNldHRpbmdzID0gZGVlcG1lcmdlKG5ldyBMaW5rSW5kZXhlclNldHRpbmdzKCksIGxvYWRlZFNldHRpbmdzKTtcclxuICAgICAgdGhpcy5zZXR0aW5ncy51c2VkTGlua3MgPSBbXTtcclxuICAgICAgbG9hZGVkU2V0dGluZ3MudXNlZExpbmtzPy5mb3JFYWNoKChyOiBVc2VkTGlua3MpID0+IHtcclxuICAgICAgICB0aGlzLnNldHRpbmdzLnVzZWRMaW5rcy5wdXNoKGRlZXBtZXJnZShuZXcgVXNlZExpbmtzKCksIHIpKVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBuZXcgTGlua0luZGV4ZXJTZXR0aW5ncygpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZWxvYWRTZXR0aW5ncygpO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgTGlua0luZGV4ZXJTZXR0aW5nVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcbiAgXHJcbiAgfVxyXG5cclxuICBhc3luYyBvbnVubG9hZCgpIHtcclxuICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICByZWxvYWRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMucmVtb3ZlT3duQ29tbWFuZHMoKTtcclxuICAgIHRoaXMuc2V0dGluZ3MudXNlZExpbmtzLmZvckVhY2goKHI6IFVzZWRMaW5rcykgPT4ge1xyXG4gICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgIGlkOiBgbGluay1pbmRleGVyOnVzZWQtbGlua3M6JHtyLm5hbWV9YCxcclxuICAgICAgICBuYW1lOiBgVXNlZCBsaW5rcyAtICR7ci5uYW1lfWAsXHJcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZ2VuZXJhdGVBbGxVc2VkTGlua3NJbmRleChnZXRQcmVzZXRCeU5hbWUodGhpcy5zZXR0aW5ncy51c2VkTGlua3MsIHIubmFtZSkpLFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlT3duQ29tbWFuZHMoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLmFwcC5jb21tYW5kcy5saXN0Q29tbWFuZHMoKS5tYXAoKGMpID0+IGMuaWQpLmZpbHRlcigoYykgPT4gYy5zdGFydHNXaXRoKHRoaXMubWFuaWZlc3QuaWQpKS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFwcC5jb21tYW5kcy5yZW1vdmVDb21tYW5kKGMpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZW5lcmF0ZUFsbFVzZWRMaW5rc0luZGV4KHByZXNldDogVXNlZExpbmtzKSB7XHJcbiAgICBpZiAoIXByZXNldCkge1xyXG4gICAgICByZXR1cm4gbmV3IE5vdGljZShgJHtwcmVzZXR9IHdhcyBub3QgZm91bmQuIFRyeSByZWxvYWRpbmcgT2JzaWRpYW4uYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB1bmlxdWVMaW5rczogUmVjb3JkPHN0cmluZywgSW5kZXhOb2RlPiA9IHt9O1xyXG5cclxuICAgIGNvbnN0IGZpbGVzID0gdGhpcy5hcHAudmF1bHQuZ2V0TWFya2Rvd25GaWxlcygpO1xyXG4gICAgZmlsZXMuZm9yRWFjaCgoZikgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc0V4Y2x1ZGVkRnJvbShmKSkgcmV0dXJuO1xyXG4gICAgICB0aGlzLmdyYWJMaW5rcyh1bmlxdWVMaW5rcywgZiwgdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoZikubGlua3MsIHByZXNldClcclxuICAgICAgaWYgKHByZXNldC5pbmNsdWRlRW1iZWRzKSB7XHJcbiAgICAgICAgdGhpcy5ncmFiTGlua3ModW5pcXVlTGlua3MsIGYsIHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGYpLmVtYmVkcywgcHJlc2V0KVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHNvcnRlZExpbmtzID0gT2JqZWN0LmVudHJpZXModW5pcXVlTGlua3MpLnNvcnQoKGEsIGIpID0+IGJbMV0uY291bnQgLSBhWzFdLmNvdW50KTtcclxuICAgIGNvbnN0IHNlcGFyYXRvciA9IHByZXNldC5zdHJpY3RMaW5lQnJlYWtzID8gJ1xcblxcbicgOiAnXFxuJztcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBzb3J0ZWRMaW5rcy5tYXAoKGwpID0+IGAke2xbMV0uY291bnR9ICR7bFsxXS5saW5rfWApLmpvaW4oc2VwYXJhdG9yKTtcclxuICAgIGNvbnN0IGV4aXN0ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5leGlzdHMobm9ybWFsaXplUGF0aChwcmVzZXQucGF0aCksIGZhbHNlKTtcclxuICAgIGlmIChleGlzdCkge1xyXG4gICAgICBjb25zdCBwID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5vcm1hbGl6ZVBhdGgocHJlc2V0LnBhdGgpKTtcclxuICAgICAgdGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZShub3JtYWxpemVQYXRoKHByZXNldC5wYXRoKSwgY29udGVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFwcC52YXVsdC5jcmVhdGUocHJlc2V0LnBhdGgsIGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNFeGNsdWRlZEZyb20oZjogVEZpbGUpIHtcclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzLnVzZWRMaW5rcy5tYXAoKHIpID0+IHIucGF0aCkuaW5jbHVkZXMoZi5wYXRoKTtcclxuICB9XHJcblxyXG4gIGdyYWJMaW5rcyh1bmlxdWVMaW5rczogUmVjb3JkPHN0cmluZywgSW5kZXhOb2RlPiwgZjogVEZpbGUsIGxpbmtzOiBSZWZlcmVuY2VDYWNoZVtdLCBwcmVzZXQ6IFVzZWRMaW5rcykge1xyXG4gICAgbGlua3M/LmZvckVhY2goKGwpID0+IHtcclxuICAgICAgY29uc3QgbGluayA9IGdldExpbmtwYXRoKGwubGluayk7XHJcbiAgICAgIGNvbnN0IG9yaWdpbkZpbGUgPSB0aGlzLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpcnN0TGlua3BhdGhEZXN0KGxpbmssIGYucGF0aCk7XHJcbiAgICAgIGlmIChwcmVzZXQubm9uZXhpc3RlbnRPbmx5ICYmIG9yaWdpbkZpbGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgb3JpZ2luID0gb3JpZ2luRmlsZSA/IG9yaWdpbkZpbGUucGF0aCA6IGxpbms7XHJcbiAgICAgIGlmICh1bmlxdWVMaW5rc1tvcmlnaW5dKSB7XHJcbiAgICAgICAgdW5pcXVlTGlua3Nbb3JpZ2luXS5jb3VudCArPSAxO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJhd0xpbmsgPSBvcmlnaW5GaWxlID8gdGhpcy5hcHAubWV0YWRhdGFDYWNoZS5maWxlVG9MaW5rdGV4dChvcmlnaW5GaWxlLCBwcmVzZXQucGF0aCwgdHJ1ZSkgOiBsaW5rO1xyXG4gICAgICAgIHVuaXF1ZUxpbmtzW29yaWdpbl0gPSB7XHJcbiAgICAgICAgICBjb3VudDogMSxcclxuICAgICAgICAgIGxpbms6IHByZXNldC5saW5rVG9GaWxlcyA/IGBbWyR7cmF3TGlua31dXWAgOiByYXdMaW5rXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBVc2VkTGlua3Mge1xyXG4gIG5hbWU6IHN0cmluZztcclxuICBwYXRoOiBzdHJpbmc7XHJcbiAgc3RyaWN0TGluZUJyZWFrcyA9IHRydWU7XHJcbiAgaW5jbHVkZUVtYmVkcyA9IHRydWU7XHJcbiAgbGlua1RvRmlsZXMgPSB0cnVlO1xyXG4gIG5vbmV4aXN0ZW50T25seSA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubmFtZSA9IERhdGUubm93KCkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMucGF0aCA9IGAuL3VzZWRfbGlua3Mke3RoaXMubmFtZX0ubWRgO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgTGlua0luZGV4ZXJTZXR0aW5ncyB7XHJcbiAgdXNlZExpbmtzOiBVc2VkTGlua3NbXSA9IFtdO1xyXG59XHJcblxyXG50eXBlIFByZXNldCA9IFVzZWRMaW5rcztcclxuXHJcbmZ1bmN0aW9uIGdldFByZXNldEJ5TmFtZShwcmVzZXRzOiBQcmVzZXRbXSwgbmFtZTogc3RyaW5nKTogUHJlc2V0IHtcclxuICByZXR1cm4gcHJlc2V0cy5maW5kKChyKSA9PiByLm5hbWUgPT09IG5hbWUpO1xyXG59XHJcblxyXG5jbGFzcyBMaW5rSW5kZXhlclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgbGV0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XHJcbiAgICBjb25zdCBwbHVnaW46IExpbmtJbmRleGVyID0gKHRoaXMgYXMgYW55KS5wbHVnaW47XHJcblxyXG4gICAgY29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcbiAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ1VzZWQgbGlua3MnfSk7XHJcblxyXG4gICAgcGx1Z2luLnNldHRpbmdzLnVzZWRMaW5rcy5mb3JFYWNoKChyZXBvcnQpID0+IHtcclxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgLnNldE5hbWUoJ1ByZXNldCBuYW1lJylcclxuICAgICAgICAuc2V0RGVzYygnQWxsb3dlZCBjaGFyYWN0ZXJzOiBBU0NJSSBsZXR0ZXJzLCBkaWdpdHMsIHVuZGVyc2NvcmVzLCBzcGFjZXMnKVxyXG4gICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PiBcclxuICAgICAgICAgIHRleHQuc2V0UGxhY2Vob2xkZXIocmVwb3J0Lm5hbWUpXHJcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcihyZXBvcnQubmFtZSlcclxuICAgICAgICAgICAgLnNldFZhbHVlKHJlcG9ydC5uYW1lKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICByZXBvcnQubmFtZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEoeyByZWZyZXNoVUk6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgIC5zZXROYW1lKCdBbGwgdXNlZCBsaW5rcycpXHJcbiAgICAgICAgLnNldERlc2MoJ1BhdGggdG8gdGhlIG5vdGUgdGhhdCB3aWxsIGNvbnRhaW4gYWxsIGZvdW5kIGxpbmtzIHNvcnRlZCBieSB0aGVpciBvY2N1cnJlbmNlcycpXHJcbiAgICAgICAgLmFkZFRleHQoKHRleHQpID0+IFxyXG4gICAgICAgICAgdGV4dFxyXG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIocmVwb3J0LnBhdGgpXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZShyZXBvcnQucGF0aClcclxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgIHJlcG9ydC5wYXRoID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh7IHJlZnJlc2hVSTogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgXHJcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgIC5zZXROYW1lKCdJbmNsdWRlIGVtYmVkcycpXHJcbiAgICAgICAgLnNldERlc2MoJ1doZW4gZGlzYWJsZWQsIG9ubHkgZGlyZWN0IGxpbmtzIGFyZSBjb3VudGVkLiBFbmFibGUgdG8gaW5jbHVkZSBlbWJlZGRlZCAodHJhc2NsdWRlZCkgbGlua3MuJylcclxuICAgICAgICAuYWRkVG9nZ2xlKCh2YWx1ZSkgPT4gXHJcbiAgICAgICAgICB2YWx1ZVxyXG4gICAgICAgICAgICAuc2V0VmFsdWUocmVwb3J0LmluY2x1ZGVFbWJlZHMpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICByZXBvcnQuaW5jbHVkZUVtYmVkcyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEoeyByZWZyZXNoVUk6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICAgIFxyXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAuc2V0TmFtZSgnTm9uZXhpc3RlbnQgZmlsZXMgb25seScpXHJcbiAgICAgICAgLnNldERlc2MoJ1doZW4gZGlzYWJsZWQsIGxpbmtzIHRvIGJvdGggZXhpc3RpbmcgYW5kIG5vbmV4aXN0aW5nIGZpbGVzIGFyZSBjb3VudGVkLicpXHJcbiAgICAgICAgLmFkZFRvZ2dsZSgodmFsdWUpID0+IFxyXG4gICAgICAgICAgdmFsdWVcclxuICAgICAgICAgICAgLnNldFZhbHVlKHJlcG9ydC5ub25leGlzdGVudE9ubHkpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICByZXBvcnQubm9uZXhpc3RlbnRPbmx5ID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh7IHJlZnJlc2hVSTogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcblxyXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuICAgICAgICAuc2V0TmFtZSgnU3RyaWN0IGxpbmUgYnJlYWtzJylcclxuICAgICAgICAuc2V0RGVzYygnQ29ycmVzcG9uZHMgdG8gdGhlIHNhbWUgRWRpdG9yIHNldHRpbmc6IFwib2ZmXCIgPSBvbmUgbGluZSBicmVhaywgXCJvblwiID0gdHdvIGxpbmUgYnJlYWtzLicpXHJcbiAgICAgICAgLmFkZFRvZ2dsZSgodmFsdWUpID0+IFxyXG4gICAgICAgICAgdmFsdWVcclxuICAgICAgICAgICAgLnNldFZhbHVlKHJlcG9ydC5zdHJpY3RMaW5lQnJlYWtzKVxyXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVwb3J0LnN0cmljdExpbmVCcmVha3MgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHsgcmVmcmVzaFVJOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICBcclxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgICAgLnNldE5hbWUoJ0xpbmsgdG8gZmlsZXMnKVxyXG4gICAgICAgIC5zZXREZXNjKCdXaGVuIFwib25cIiB0aGUgb3V0cHV0IGZpbGUgd2lsbCB1c2Ugd2lraS1saW5rcyB0byBmaWxlcy4gRGlzYWJsZSBpZiB5b3UgZG9uXFwndCB3YW50IHRvIHBvbGx1dGUgZ3JhcGggd2l0aCBpdC4nKVxyXG4gICAgICAgIC5hZGRUb2dnbGUoKHZhbHVlKSA9PiBcclxuICAgICAgICAgIHZhbHVlXHJcbiAgICAgICAgICAgIC5zZXRWYWx1ZShyZXBvcnQubGlua1RvRmlsZXMpXHJcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICByZXBvcnQubGlua1RvRmlsZXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHsgcmVmcmVzaFVJOiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgICBjb25zdCBkZWxldGVCdXR0b24gPSBuZXcgU2V0dGluZyhjb250YWluZXJFbCkuYWRkQnV0dG9uKChleHRyYSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBleHRyYS5zZXRCdXR0b25UZXh0KCdEZWxldGUgcHJlc2V0Jykub25DbGljayhhc3luYygpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGx1Z2luLnNldHRpbmdzLnVzZWRMaW5rcy5maW5kSW5kZXgoKHIpID0+IHIubmFtZSA9PT0gcmVwb3J0Lm5hbWUpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgcGx1Z2luLnNldHRpbmdzLnVzZWRMaW5rcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkZWxldGVCdXR0b24uc2V0dGluZ0VsLnN0eWxlLmJvcmRlckJvdHRvbSA9ICcxcHggc29saWQgdmFyKC0tdGV4dC1hY2NlbnQpJztcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFkZEJ1dHRvbiA9IG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKS5hZGRCdXR0b24oKGJ1dHRvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYnV0dG9uLnNldEJ1dHRvblRleHQoJ0FkZCBwcmVzZXQnKS5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICBwbHVnaW4uc2V0dGluZ3MudXNlZExpbmtzLnB1c2gobmV3IFVzZWRMaW5rcygpKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYWRkQnV0dG9uLmluZm9FbC5yZW1vdmUoKTtcclxuICAgIGFkZEJ1dHRvbi5zZXR0aW5nRWwuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnY2VudGVyJztcclxuICB9XHJcblxyXG4gIGFzeW5jIHNhdmVEYXRhKG9wdGlvbnMgPSB7IHJlZnJlc2hVSTogdHJ1ZSB9KSB7XHJcbiAgICBjb25zdCBwbHVnaW46IExpbmtJbmRleGVyID0gKHRoaXMgYXMgYW55KS5wbHVnaW47XHJcbiAgICBhd2FpdCBwbHVnaW4uc2F2ZURhdGEocGx1Z2luLnNldHRpbmdzKTtcclxuICAgIHBsdWdpbi5yZWxvYWRTZXR0aW5ncygpO1xyXG4gICAgaWYgKG9wdGlvbnMucmVmcmVzaFVJKSB0aGlzLmRpc3BsYXkoKTtcclxuICB9XHJcbn0iXSwibmFtZXMiOlsiZGVlcG1lcmdlIiwiTm90aWNlIiwibm9ybWFsaXplUGF0aCIsImdldExpbmtwYXRoIiwiUGx1Z2luIiwiU2V0dGluZyIsIlBsdWdpblNldHRpbmdUYWIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNuQyxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztBQUN6QyxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsUUFBUSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDMUcsSUFBSSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBQ0Y7QUFDTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ2hDLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFJLFNBQVMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUMzQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQztBQXVDRDtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVM7QUFDakUsZ0JBQWdCO0FBQ2hCLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFO0FBQ2hJLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQzFHLG9CQUFvQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFD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
