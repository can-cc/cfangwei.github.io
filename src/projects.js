'use strict';

let colorPalettes = require('./misc/languageColor.json');


let $ = require('jquery'),
    _ = require('lodash'),
    R = require('ramda');


let Impure = {
    getJSON: _.curry((callback, url) => {
        $.getJSON(url, callback);
    }),
    setLanuageHtml: _.curry((dom, data) => {
        let total = _.values(data).reduce((res, v) => {
            return res + v;
        }, 0);
        
        let html = _.keys(data).reduce((res, v) => {
            let percentage = data[v] / total * 100,
                color = colorPalettes[v].color;

            return res + `<li>
                              <span class="color-bar" style="width:${percentage}%; background-color:${color};"></span>
                              <span class="language-name">${v}: </span>
                              <span class="language-number"> ${data[v]} Lines</span>
                          </li>`;
        }, '');
        
        $(dom).find('.languages').html(html);
    })
};


let languagesUrl = (id) => {
    return `https://api.github.com/repos/${id}/languages`;
};

let getGithubProject = () => {
    return $('.project-card[github]');
};

let fetchLanguages = (setLanuageHtml, id) => {
    R.compose(Impure.getJSON(setLanuageHtml), languagesUrl)(id);
};


import {txtSnake} from './misc/txtSnake.js';

let listenTitleShake = () => {
    var cancel;
    $('.project-card .title h2 a').hover(function(){
        cancel = txtSnake(this, 50);
    }, function(){
        cancel();
    });

    $(window).on('blur', () => {
        cancel && cancel();
    });
};




var Vue = require('vue');

var app = new Vue({
    el: '#project',
    components: {
        'project-card': Vue.extend(require('./component/project-card/')),
        'hang-bookmark': Vue.extend(require('./component/hang-bookmark/')),
        'bookmark-footer': Vue.extend(require('./component/bookmark-footer/'))
    },
    ready: function(){
        getGithubProject().map(function(i, projectDom){
            let setLanuageDate = Impure.setLanuageHtml(projectDom);
            fetchLanguages(setLanuageDate, $(projectDom).data('id'));
        });
        listenTitleShake();
    }
});
