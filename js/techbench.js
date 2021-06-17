function updateDownloadLinks() {
    if (document.getElementById('language').value != '') {
        document.getElementById('loader').classList.add('active');
        var uuid = uuidv4();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                xhr.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var downloadLinksContent = document.getElementById('download-links-content');
                        var forumPostContent = document.getElementById('forum-post-content');
                        var microsoftContent = document.createElement('html');
                        microsoftContent.innerHTML = this.responseText;
                        var links = microsoftContent.getElementsByTagName('a');
                        for (var i = 0; i < links.length; i++) {
                            if (links.length == 1) {
                                document.getElementById('error-header').innerHTML = 'Response error';
                                document.getElementById('error-content').innerHTML = 'An error occured during making requests to the Microsoft API. Are you sure you\'re logged in on the <a href="https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewiso">Microsoft Insider Preview</a> page?';
                                document.getElementById('error-container').classList.remove('hidden');
                            } else {
                                var link = links[i].getAttribute('href');
                                if (link == 'https://support.microsoft.com/en-us/contactus/') {
                                    document.getElementById('error-header').innerHTML = 'Response error';
                                    document.getElementById('error-content').innerHTML = 'An error occured during making requests to the Microsoft API. You\'ve exceeded your limit.';
                                    document.getElementById('error-container').classList.remove('hidden');
                                } else if (link != 'https://www.microsoft.com/en-us/software-download/faq') {
                                    var validUntil = getHumanReadableDateTime(link.split('&')[1].substring(2) * 1000);
                                    downloadLinksContent.innerHTML += '<tr><td><a href="' + link + '">' + link.split('/').pop().split('?')[0] + '</a></td><td>' + validUntil + '</td></tr>';
                                    forumPostContent.innerHTML += '[URL=\'' + link + '\']' + link.split('/').pop().split('?')[0] + '[/URL][PLAIN] - Valid until: ' + validUntil + '[/PLAIN]\n';
                                    document.getElementById('download-links-container').classList.remove('hidden');
                                    $('.ui.styled.fluid.accordion').accordion();
                                    document.getElementById('forum-post-container').classList.remove('hidden');
                                }
                            }
                        }
                    }
                    if (this.readyState == 4) {
                        document.getElementById('loader').classList.remove('active')
                    }
                }
                xhr.open('GET', 'https://www.microsoft.com/en-us/api/controls/contentinclude/html?pageId=cfa9e580-a81e-4a4b-a846-7b21bf4e2e5b&host=www.microsoft.com&segments=software-download%2Cwindows10ISO&query=&action=GetProductDownloadLinksBySku&sessionId=' + uuid + '&skuId=' + document.getElementById('language').value + '&sdVersion=2', true);
                xhr.withCredentials = true;
                xhr.send();
            } else if (this.readyState == 4 && this.status != 200) {
                document.getElementById('error-header').innerHTML = 'Response error';
                document.getElementById('error-content').innerHTML = 'An error occured during making requests to the Microsoft API. Are you sure you\'re logged in on the <a href="https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewiso">Microsoft Insider Preview</a> page?';
                document.getElementById('error-container').classList.remove('hidden');
                document.getElementById('loader').classList.remove('active');
            }
        }
        xhr.open('GET', 'https://www.microsoft.com/en-us/api/controls/contentinclude/html?pageId=cd06bda8-ff9c-4a6e-912a-b92a21f42526&host=www.microsoft.com&segments=software-download%2cwindows10ISO&query=&action=getskuinformationbyproductedition&sessionId=' + uuid + '&productEditionId=' + new URLSearchParams(window.location.search).get('id') + '&sdVersion=2', true);
        xhr.send();
    }
}

function updateMetadata() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var dump = JSON.parse(this.responseText);
            var urlSearchParams = new URLSearchParams(window.location.search);
            if (urlSearchParams.has('id') && urlSearchParams.get('id') in dump) {
                var query = urlSearchParams.get('id');
                var name = dump[query]['name'];
                document.getElementById('name-content').innerHTML = '<i class="fitted file download circle icon"></i> ' + name;
                if (name.toLowerCase().includes('preview') || name.toLowerCase().includes('rs4') || name.toLowerCase().includes('- build') || name.toLowerCase().includes('app compatibility fod') || name.toLowerCase().includes('windows admin center preview')) {
                    document.getElementById('insider-preview-information-header').innerHTML = 'Windows Insider account required';
                    document.getElementById('insider-preview-information-content').innerHTML = 'You\'ve chosen a Windows Insider product. Make sure you\'re logged in your Windows Insider account at the <a href="https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewadvanced">Windows Insider Preview</a> page.';
                    document.getElementById('insider-preview-information-container').classList.remove('hidden');
                }
                var content = document.getElementById('language-content');
                var sorted = Object.values(dump[query]['languages']).sort();
                for (var i = 0; i < sorted.length; i++) {
                    for (var key in dump[query]['languages']) {
                        if (dump[query]['languages'][key] == sorted[i]) {
                            content.innerHTML += '<div class="item" data-value="' + key + '">' + dump[query]['languages'][key] + '</div>';
                        }
                    }
                }
                $('.ui.fluid.search.selection.dropdown').dropdown();
                document.getElementById('language-container').classList.remove('hidden');
            } else {
                document.getElementById('name-content').innerHTML = '<i class="fitted file download circle icon"></i> Unknown product';
                document.getElementById('error-header').innerHTML = 'Invalid ID';
                document.getElementById('error-content').innerHTML = 'The requested ID was not found. Please try another one.';
                document.getElementById('error-container').classList.remove('hidden');
            }
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById('error-header').innerHTML = 'Internal error';
            document.getElementById('error-content').innerHTML = 'An internal error occured. If the error persists, please report it on our Discord server.';
            document.getElementById('error-container').classList.remove('hidden');
        }
        if (this.readyState == 4) {
            document.getElementById('loader').classList.remove('active');
        }
    }
    xhr.open('GET', 'dump.json', true);
    xhr.send();
}

function updateProductsTable() {
    var urlSearchParams = new URLSearchParams(window.location.search);
    document.getElementById('search').setAttribute('value', urlSearchParams.has('q') ? urlSearchParams.get('q') : '');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var dump = JSON.parse(this.responseText);
            var content = '';
            var forumPostContent = document.getElementById('forum-post-content');
            var reversed = Object.keys(dump).reverse();
            var query = urlSearchParams.has('q') ? urlSearchParams.get('q') : '';
            var querySuccess = false;
            for (var i in reversed) {
                if (dump[reversed[i]]['name'].toLowerCase().match(wildcardToRegExp(query.toLowerCase()))) {
                    content += '<tr><td><a href="download.html?id=' + reversed[i] + '">' + dump[reversed[i]]['name'] + '</a></td><td><code>' + reversed[i] + '</code></td></tr>';
                    forumPostContent.innerHTML += '[URL=\'' + window.location.protocol + '//' + window.location.host + '/download.html?id=' + reversed[i] + '\']' + dump[reversed[i]]['name'] + '[/URL][PLAIN] - ID: ' + reversed[i] + '[/PLAIN]\n';
                    querySuccess = true;
                }
            }
            if (querySuccess) {
                document.getElementById('content').innerHTML = content;
                document.getElementById('content-container').classList.remove('hidden');
                $('.ui.styled.fluid.accordion').accordion();
                document.getElementById('forum-post-container').classList.remove('hidden');
            } else {
                document.getElementById('error-header').innerHTML = 'No results';
                document.getElementById('error-content').innerHTML = 'No results were found for your query.';
                document.getElementById('error-container').classList.remove('hidden');
            }
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById('error-header').innerHTML = 'Internal error';
            document.getElementById('error-content').innerHTML = 'An internal error occured. If the error persists, please report it on our Discord server.';
            document.getElementById('error-container').classList.remove('hidden');
        }
        if (this.readyState == 4) {
            document.getElementById('loader').classList.remove('active');
        }
    }
    xhr.open('GET', 'dump.json', true);
    xhr.send();
}

function updateRecentlyAddedProductsTable() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var dump = JSON.parse(this.responseText);
            var content = document.getElementById('content');
            var reversed = Object.keys(dump).reverse();
            var i = 0;
            while (i < 10) {
                content.innerHTML += '<tr><td><a href="download.html?id=' + reversed[i] + '">' + dump[reversed[i]]['name'] + '</a></td><td><code>' + reversed[i] + '</code></td></tr>';
                i++;
            }
            document.getElementById('content-container').classList.remove('hidden');
        } else if (this.readyState == 4 && this.status != 200) {
            document.getElementById('error-header').innerHTML = 'Internal error';
            document.getElementById('error-content').innerHTML = 'An internal error occured. If the error persists, please report it on our Discord server.';
            document.getElementById('error-container').classList.remove('hidden');
        }
        if (this.readyState == 4) {
            document.getElementById('loader').classList.remove('active');
        }
    }
    xhr.open('GET', 'dump.json', true);
    xhr.send();
}
