var homeClassList = 'item';
var productsClassList = 'item';
var page = window.location.pathname.split('/').pop();
switch (page) {
    case 'download.html':
    case 'products.html':
        productsClassList = 'active item';
        break;
    default:
        homeClassList = 'active item';
        break;
}
document.getElementById('mobile-tablet-menu').innerHTML = '<div class="ui container"><a class="item" onclick="toggleSidebar();"><i class="bars icon"></i>Menu</a></div>';
document.getElementById('computer-menu').innerHTML = '<div class="ui container"><a href="." class="' + homeClassList + '"><i class="home icon"></i>Home</a><a href="products.html" class="' + productsClassList + '"><i class="server icon"></i>Products</a><div class="right menu"><a id="darkmode-button2" onclick="toggleDarkmode();" class="item"></a><a href="https://discord.gg/wCB4RJTbGd" class="item"><i class="discord icon"></i>Discord</a><a href="https://github.com/luzeagithub/techbench-dump-web" class="item"><i class="github icon"></i>GitHub</a></div></div>';
document.getElementById('sidebar').innerHTML = '<a href="." class="' + homeClassList + '"><i class="home icon"></i>Home</a><a href="products.html" class="' + productsClassList + '"><i class="server icon"></i>Products</a><a id="darkmode-button1" onclick="toggleDarkmode();" class="item"></a><a href="https://discord.gg/wCB4RJTbGd" class="item"><i class="discord icon"></i>Discord</a><a href="https://github.com/luzeagithub/techbench-dump-web" class="item"><i class="github icon"></i>GitHub</a>';
