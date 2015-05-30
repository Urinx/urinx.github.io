function loadimg(arr,funLoading,funOnLoad,funOnError){
	var numLoaded=0,
	numError=0,
	isObject=Object.prototype.toString.call(arr)==="[object Object]" ? true : false;
 
	var arr=isObject ? arr.get() : arr;
	for(a in arr){
		var src=isObject ? $(arr[a]).attr("data-src") : arr[a];
		preload(src,arr[a]);
	}
 
	function preload(src,obj){
		var img=new Image();
		img.onload=function(){
			numLoaded++;
			funLoading && funLoading(numLoaded,arr.length,src,obj);
			funOnLoad && numLoaded==arr.length && funOnLoad(numError);
		};
		img.onerror=function(){
			numLoaded++;
			numError++;
			funOnError && funOnError(numLoaded,arr.length,src,obj);
		}
		img.src=src;
	}
 
}

$(document).ready(function(){
	var MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/["']/g, ""),
		pageIndex=0,
		maxIndex=$('.page-index li').length-1;

	function curPage(i){
		$('ul.page').animate({left:-$(document).width()*i});

		$('.page-index li').each(function(){
			this.style.background='rgba(255,255,255,0.4)';
		});
		$('.page-index li')[i].style.background='rgba(255,255,255,1)';
	}

	if (MQ == 'mobile') {
		setTimeout(function(){
			$('.wrap').css('display','none');
			$('.mobile').css('opacity','1');
		},5000);
	}
	else {
		// ==== Preload images =====
		var imgSrcArr=[
		'res/bg.jpg',
		'res/apps/Safari.app.png',
		'res/apps/Mail.app.png',
		'res/apps/Contacts.app.png',
		'res/apps/Calendar.app.png',
		'res/apps/Reminders.app.png',
		'res/apps/Notes.app.png',
		'res/apps/Maps.app.png',
		'res/apps/Messages.app.png',
		'res/apps/FaceTime.app.png',
		'res/apps/Photo Booth.app.png',
		'res/apps/iTunes.app.png',
		'res/apps/iBooks.app.png',
		'res/apps/App Store.app.png',
		'res/apps/Game Center.app.png',
		'res/apps/Preview.app.png',
		'res/apps/Dictionary.app.png',
		'res/apps/Calculator.app.png',
		'res/apps/Dashboard.app.png',
		'res/apps/iPhoto.app.png',
		'res/apps/GarageBand.app.png',
		'res/apps/iMovie.app.png',
		'res/apps/Numbers.app.png',
		'res/apps/Keynote.app.png',
		'res/apps/Pages.app.png',
		'res/apps/Photos.app.png',
		'res/apps/Mission Control.app.png',
		'res/apps/System Preferences.app.png',
		'res/apps/VirtualBox.app.png',
		'res/apps/Xcode.app.png',
		'res/apps/Evernote.app.png',
		'res/apps/Pocket.app.png',
		'res/apps/feedly.app.png',
		'res/apps/Alfred 2.app.png',
		'res/apps/SystemPal.app.png',
		'res/apps/BetterTouchTool.app.png',
		'res/apps/Pushbullet.app.png',
		'res/apps/Tumblr.app.png',
		'res/apps/Shazam.app.png',
		'res/apps/MPlayerX.app.png',
		'res/apps/Sublime Text.app.png',
		'res/apps/Microsoft Remote Desktop.app.png',
		'res/apps/Google Chrome.app.png',
		'res/apps/VMware Fusion.app.png',
		'res/apps/OmniFocus.app.png',
		'res/apps/7zX.app.png',
		];

		function setPage(el,a,b){
			var html=[];
			for (var i = a; i < b; i++) {
				var appItem='<a class="app-item" href="#">\
								<img src="'+imgSrcArr[i]+'" />\
								<span>'+imgSrcArr[i].replace('res/apps/','').replace('.app.png','')+'</span>\
							</a>';
				html.push(appItem);
			}
			el.innerHTML=html.join('');
		}

		loadimg(imgSrcArr,null,function(){
			setPage($('.app-list')[0],1,28);
			setPage($('.app-list')[1],28,imgSrcArr.length);
			$('.wrap').css('display','none');
			$('body').css('background','url(res/bg.jpg) no-repeat');
			$('body').css('background-size','100% 100%');
			$('.app').css('opacity','1');
			$('.dock').css('opacity','1');
		},null);
		// =========================


		// ===== Set dock ========
		$('.dock').Fisheye(
			{
				maxWidth: 50,
				items: 'a',
				itemsText: 'span',
				container: '.dock-container',
				itemWidth: 60,
				proximity: 80,
				alignment : 'left',
				valign: 'bottom',
				halign : 'center'
			}
		);
		// =======================

		// ===== Set page scroll ====
		curPage(pageIndex);
		
		$(document).keydown(function(e){
			switch(e.keyCode){
				case 39:
					pageIndex+=1;
					pageIndex=pageIndex>maxIndex?maxIndex:pageIndex;
					break;
				case 37:
					pageIndex-=1;
					pageIndex=pageIndex<0?0:pageIndex;
					break;
			}
			curPage(pageIndex);
		});
		// =========================
	}
});