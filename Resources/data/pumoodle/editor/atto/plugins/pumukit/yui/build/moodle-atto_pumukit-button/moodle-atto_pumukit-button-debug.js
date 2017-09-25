YUI.add('moodle-atto_pumukit-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_pumukit
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_pumukit_alignment-button
 */

/**
 * Atto pumukit selection tool.
 *
 * @namespace M.atto_pumukit
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */



var PUMUKITURL = 'http://localhost/app_dev.php/pumoodle/searchmultimediaobjects';

var COMPONENTNAME = 'atto_pumukit';
var FLAVORCONTROL = 'pumukit_flavor';
var LOGNAME = 'atto_pumukit';

var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        FLAVORCONTROL: 'flavorcontrol'
    },
    SELECTORS = {
        FLAVORCONTROL: '.flavorcontrol'
    };

var TEMPLATE = '' +
    '<iframe src="{{PUMUKITURL}}" frameborder="0" allowfullscreen style="width:100%;height:80vh">' +
    '</iframe>' +

    '<form class="atto_form">' +
        '<input class="{{CSS.FLAVORCONTROL}}" id="{{elementid}}_{{FLAVORCONTROL}}" ' +
            'name="{{elementid}}_{{FLAVORCONTROL}}" value="{{defaultflavor}}" ' +
            'type="hidden" />' +
    '</form>';

Y.namespace('M.atto_pumukit').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {


    _receiveMessageBind: null,

    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')){
            return;
        }

        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_pumukit',
            buttonName: 'pumukit',
            callback: this._displayDialogue,
            callbackArgs: 'iconone'
        });

    },

    /**
     * Get the id of the flavor control where we store the ice cream flavor
     *
     * @method _getFlavorControlName
     * @return {String} the name/id of the flavor form field
     * @private
     */
    _getFlavorControlName: function(){
        return(this.get('host').get('elementid') + '_' + FLAVORCONTROL);
    },


     /**
     * Display the pumukit Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e, clickedicon) {
        e.preventDefault();
        var width=900;

        this._receiveMessageBind = this._receiveMessage.bind(this);
        window.addEventListener('message', this._receiveMessageBind);

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if(dialogue.width !== width + 'px'){
            dialogue.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon);

        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },


     /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function(clickedicon) {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                FLAVORCONTROL: FLAVORCONTROL,
                PUMUKITURL: PUMUKITURL,
                component: COMPONENTNAME,
                defaultflavor: this.get('defaultflavor'),
                clickedicon: clickedicon
            }));

        this._form = content;
        //this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert : function(e){
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var flavorcontrol = this._form.one(SELECTORS.FLAVORCONTROL);

        // If no file is there to insert, don't do it.
        if (!flavorcontrol.get('value')){
            Y.log('No flavor control or value could be found.', 'warn', LOGNAME);
            return;
        }

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(flavorcontrol.get('value'));
        this.markUpdated();

    },


    _receiveMessage : function(e){
        if (e.data.type != 'atto_pumukit') {
            return;
        }

        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        // If no file is there to insert, don't do it.
        if (!e.data.url){
            Y.log('No URL from pumukit value could be found.', 'warn', LOGNAME);
            return;
        }

        window.removeEventListener('message', this._receiveMessageBind);

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(e.data.url);
        this.markUpdated();
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
