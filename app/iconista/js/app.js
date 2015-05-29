	$(document).ready(function(){
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

		var pageIndex=0;
		var maxIndex=$('.page-index li').length-1;

		function curPage(i){
			$('ul.page').animate({left:-$(document).width()*i});

			$('.page-index li').each(function(){
				this.style.background='rgba(255,255,255,0.4)';
			});
			$('.page-index li')[i].style.background='rgba(255,255,255,1)';
		}
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

	});