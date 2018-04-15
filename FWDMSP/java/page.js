/* Thumb */
(function (window){
	
	var FWDAnimButton = function(
			imageSource,
			segmentWidth, 
			segmentHeight, 
			totalSegments, 
			animDelay,
			yoyo
			){
		
		var self  = this;
		var prototype = FWDAnimButton.prototype;
		
		this.imageSource_img = new Image();
		this.imageSource_img.src = imageSource;
		this.imageSource_img.onload = function(){
			self.dispatchEvent(FWDAnimButton.LOAD_COMPLETE);
		};
		
		this.image_do = null;
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.animDelay = animDelay || 300;
		this.currentFrame = 0;
		this.countYoyo = 0;
		
		this.delayTimerId_int;
		this.yoyoId_to;
		
		this.isGowingFWD_bl = true;
		this.yoyo_bl = yoyo;
		this.isShowed_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.hasPointerEvent_bl = FWDMSPUtils.hasPointerEvent;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.setButtonMode(true);
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			self.getStyle().zIndex = 99;
			self.setWidth(self.segmentWidth);
			self.setHeight(self.segmentHeight);
		
			self.image_do = new FWDMSPDisplayObject("img");
			self.image_do.setScreen(self.imageSource_img);
			self.image_do.setWidth(self.segmentWidth * self.totalSegments);
			self.image_do.setHeight(self.segmentHeight);
			self.image_do.hasTransform3d_bl = false;
			self.image_do.hasTransform2d_bl = false;
			self.addChild(this.image_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerUp", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mouseup", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmouseup", self.onMouseUp);
			}
		};
		
		this.onMouseOver = function(){
			self.goForward();
		};
		
		this.onMouseOut = function(){
			self.goBack();
		};
		
		this.onMouseUp = function(){
			self.dispatchEvent(FWDAnimButton.CLICK);
		};
		
		//###################################//
		/* goForward / stop preloader animation */
		//###################################//
		this.goForward = function(){
			self.isGowingFWD_bl = true;
			self.countYoyo = 0;
			clearInterval(self.delayTimerId_int);
			self.delayTimerId_int = setInterval(self.updatePreloader, self.animDelay);
			self.dispatchEvent(FWDAnimButton.GO_FWD);
		};
		
		this.goBack = function(){
			self.isGowingFWD_bl = false;
			self.countYoyo = 0
			clearInterval(self.delayTimerId_int);
			self.delayTimerId_int = setInterval(self.updatePreloader, self.animDelay);
		};
		
		this.stop = function(){
			clearInterval(self.delayTimerId_int);
			self.currentFrame = 0;
			self.image_do.setX(0);
		};
		
		this.updatePreloader = function(){
			if(self.isGowingFWD_bl){
				self.currentFrame++;
				self.countYoyo++;
				if(self.yoyo_bl && self.countYoyo == 40) self.goBack();
			}else{
				self.currentFrame--;
			}
			
			if(self.currentFrame > self.totalSegments - 2){
				self.currentFrame = self.totalSegments - 2;
				self.dispatchEvent(FWDAnimButton.GO_FWD_COMPLETE);
			}else if(self.currentFrame < 0){
				self.currentFrame = 0;
				clearInterval(self.delayTimerId_int);
				self.dispatchEvent(FWDAnimButton.GO_BACK_COMPLETE);
			}
			
			var posX = self.currentFrame * self.segmentWidth;
			self.image_do.setX(-posX);
		};
		
		this.show = function(){
			self.setX(-self.w - 5);
			FWDAnimation.to(self, .8, {x:0, ease:Expo.easeInOut});
		}
		
		this.init();
	};
	
	/* set prototype */
    FWDAnimButton.setPrototype = function(){
    	FWDAnimButton.prototype = new FWDMSPDisplayObject("div");
    };
    
    FWDAnimButton.HIDE_COMPLETE = "hideComplete";
	FWDAnimButton.GO_FWD_COMPLETE = "fwdComplete";
	FWDAnimButton.GO_BACK_COMPLETE = "backComplete";
	FWDAnimButton.GO_FWD = "goForward";
	FWDAnimButton.LOAD_COMPLETE = "loadComplete";
	FWDAnimButton.CLICK = "clickHandler";
    
    FWDAnimButton.prototype = null;
	window.FWDAnimButton = FWDAnimButton;
}(window));/* FWDMSPAPIButton */
(function (window){
var FWDMSPAPIButton = function(label, reverseColors){
		
		var self = this;
		var prototype = FWDMSPAPIButton.prototype;
		
		this.nImg_img = null;
		this.sImg_img = null;
		
		this.dumy_do = null;
	
		this.label_str = label;
		if(!reverseColors){
			this.colorN_str = "#000000";
			this.colorS_str = "#FFFFFF";
			this.bkColorN_str = "#FFFFFF";
			this.bkColorS_str = "#000000";
		}else{
			this.colorN_str = "#CCCCCC";
			this.colorS_str = "#000000";
			this.bkColorN_str = "#000000";
			this.bkColorS_str = "#FFFFFF";
		}
		
	
		this.isDisabled_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			self.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			self.setBackfaceVisibility();
			self.getStyle().display = "inline-block";
			self.getStyle().clear = "both";
			self.getStyle().fontFamily = "Arial";
			self.getStyle().fontSize= "12px";
			self.getStyle().whiteSpace= "nowrap";
			self.getStyle().margin = "0px";
			self.getStyle().marginBottom = "6px";
			self.getStyle().padding = "6px";
			self.getStyle().color = self.colorN_str;
			self.getStyle().backgroundColor = self.bkColorN_str;
			self.getStyle().fontSmoothing = "antialiased";
			self.getStyle().webkitFontSmoothing = "antialiased";
			self.getStyle().textRendering = "optimizeLegibility";	
			self.setInnerHTML(self.label_str);
			
			self.dumy_do = new FWDMSPDisplayObject("div");
			if(FWDMSPUtils.isIE){
				self.dumy_do.setBkColor("#00FF00");
				self.dumy_do.setAlpha(0.0001);
			}
			self.dumy_do.setButtonMode(true);
			self.dumy_do.getStyle().width = "100%";
			self.dumy_do.getStyle().height = "50px";
			self.addChild(self.dumy_do);
			
			if(!self.isMobile_bl){
				self.dumy_do.screen.onmouseover = self.onMouseOver;
				self.dumy_do.screen.onmouseout = self.onMouseOut;
			}
			self.dumy_do.screen.onclick = self.onClick;
		};
		
		this.onMouseOver = function(e){
			if(self.isDisabled_bl) return;
			FWDAnimation.to(self.screen, .8, {css:{color:self.colorS_str, backgroundColor:self.bkColorS_str}, ease:Expo.easeOut});
		};
			
		this.onMouseOut = function(e){
			if(self.isDisabled_bl) return;
			FWDAnimation.to(self.screen, .8, {css:{color:self.colorN_str, backgroundColor:self.bkColorN_str}, ease:Expo.easeOut});
		};
			
		this.onClick = function(e){
			if(self.isDisabled_bl) return;
			self.dispatchEvent(FWDMSPAPIButton.CLICK);
		};
		
		//#####################################//
		/* disable / enable */
		//#####################################//
		this.disable = function(){
			self.isDisabled_bl = true;
			self.dumy_do.setButtonMode(false);
			FWDAnimation.killTweensOf(self);
			self.getStyle().color = self.colorN_str;
			self.getStyle().backgroundColor = self.bkColorN_str;
			self.setAlpha(.2);
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.dumy_do.setButtonMode(true);
			self.setAlpha(.1);
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDMSPAPIButton.setPrototype = function(){
		FWDMSPAPIButton.prototype = null;
		FWDMSPAPIButton.prototype = new FWDMSPDisplayObject("div", "relative");
	};
	
	FWDMSPAPIButton.CLICK = "onClick";
	
	FWDMSPAPIButton.prototype = null;
	window.FWDMSPAPIButton = FWDMSPAPIButton;
}(window));/* Thumb */
(function (window){
	
	var FWDBuyButton = function(
			imageSource1,
			imageSource2,
			segmentWidth, 
			segmentHeight, 
			totalSegments, 
			animDelay
			){
		
		var self  = this;
		var prototype = FWDBuyButton.prototype;
		
		this.imageSource1_str = imageSource1;
		this.imageSource2_str = imageSource2;
		
		this.buy_do = null;
		this.hello_do = null;
		
		this.showHelloId_to;
		
		this.segmentWidth = segmentWidth;
		this.segmentHeight = segmentHeight;
		this.totalSegments = totalSegments;
		this.animDelay = animDelay || 300;
		this.isHellowShowed_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		
		//###################################//
		/* init */
		//###################################//
		this.init = function(){
			self.setWidth(self.segmentWidth);
			self.setHeight(self.segmentHeight);
			
			FWDAnimButton.setPrototype();
			self.buy_do = new FWDAnimButton(
			self.imageSource1_str, 
			self.segmentWidth, 
			self.segmentHeight, 
			self.totalSegments, 
			50,
			false);
			self.buy_do.addListener(FWDAnimButton.GO_FWD, self.buyGoFWDHandler);
			self.buy_do.addListener(FWDAnimButton.GO_BACK_COMPLETE, self.buyAnimBackCompleteHandler);
			self.buy_do.addListener(FWDAnimButton.LOAD_COMPLETE, self.buyLoadCompleteHanlder);
			self.buy_do.addListener(FWDAnimButton.CLICK, self.buyClickHandler);
			self.buy_do.setAlpha(0);
			self.addChild(self.buy_do);
			
			if(FWDMSPUtils.isIEAndLessThen9 || self.isMobile_bl){
				self.buy_do.setAlpha(1);
				return;
			}
		
			window.addEventListener("scroll", self.scrollHandler);
			
			FWDAnimButton.setPrototype();
			self.hello_do = new FWDAnimButton(
			self.imageSource2_str, 
			self.segmentWidth, 
			self.segmentHeight, 
			self.totalSegments, 
			50,
			true);
			self.hello_do.addListener(FWDAnimButton.GO_BACK_COMPLETE, self.helloAnimBackCompleteHandler);
			
			
			self.hello_do.setAlpha(0);
			self.addChild(self.hello_do);
			self.addChild(self.buy_do);
			
			self.showHello();
		};
		
		this.buyClickHandler = function(){
			location.href = "http://codecanyon.net/item/mp3-sticky-player/6552687?ref=FWDesign";
		}
		
		this.buyLoadCompleteHanlder = function(){
			self.buy_do.setAlpha(1);
			if(!self.isMobile_bl) self.buy_do.show();
		};
		
		this.scrollHandler = function(){
			var scrOfssets = FWDMSPUtils.getScrollOffsets();
			if(scrOfssets.y < 120){
				self.showHello();
			}
		}
		
		this.showHello = function(){
			if(self.isHellowShowed_bl) return;
			var scrOfssets = FWDMSPUtils.getScrollOffsets();
			if(scrOfssets.y > 120) return;
			self.isHellowShowed_bl = true;
			clearTimeout(self.showHelloId_to);
			self.showHelloId_to = setTimeout(function(){
				self.buy_do.setAlpha(0);
				self.hello_do.setAlpha(1);
				self.hello_do.goForward();
			}, 4000 + (Math.random() * 6000));
		}
		
		this.showBuy = function(){
			self.isHellowShowed_bl = false;
			clearTimeout(self.showHelloId_to);
			self.buy_do.setAlpha(1);
			if(self.hello_do) self.hello_do.setAlpha(0);
		}
		
		this.buyGoFWDHandler = function(){
			self.showBuy();
			if(self.hello_do) self.hello_do.stop();
		};
		
		this.helloAnimBackCompleteHandler = function(){
			self.showBuy();
			self.showHello();
		};
		
		this.buyAnimBackCompleteHandler = function(){
			if(FWDMSPUtils.isIEAndLessThen9 || self.isMobile_bl) return;
			self.showHello();
		};
	
		this.init();
	};
	
	/* set prototype */
    FWDBuyButton.setPrototype = function(){
    	FWDBuyButton.prototype = new FWDMSPDisplayObject("div");
    };
    
    FWDBuyButton.HIDE_COMPLETE = "hideComplete";
    
    FWDBuyButton.prototype = null;
	window.FWDBuyButton = FWDBuyButton;
}(window));/* FWDExamplePageGrid */
(function (window){
var FWDExamplePageGrid = function(props_obj){
		
		var self = this;
		var prototype = FWDExamplePageGrid.prototype;
		
		this.image_img = null;
		this.mainContainer = props_obj.mainContainer;
		
		this.thumbs_ar = [];
		
		if(props_obj.isWhite){
			this.paths_ar = [
		       "graphics/1w.jpg",
		       "graphics/2w.jpg",
		       "graphics/3w.jpg",
		       "graphics/4w.jpg"
		    ];
		}else{
			this.paths_ar = [
		       "graphics/1.jpg",
		       "graphics/2.jpg",
		       "graphics/3.jpg",
		       "graphics/4.jpg"
		    ];
		}
		
		
		this.id = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.dif = 0;
		this.tempId = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.thumbW = 0;
		this.thumbH = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.thumbnailMaxWidth = 225;
		this.thumbnailMaxHeight = 191;
		this.spacerH = 20;
		this.spacerV = 19;
		this.howManyThumbsToDisplayH = 0;
		this.howManyThumbsToDisplayV = 0;
		this.totalThumbnails = this.paths_ar.length;
		this.delayRate = .06;
		this.countLoadedThumbs = 0;
		
		this.examplesThumbsBkColor_str = props_obj.examplesThumbsBkColor;
		
		this.hideCompleteId_to;
		this.showCompleteId_to;
		this.loadThumbnailsId_to;
		
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setOverflow("visible");
			self.mainContainer.style.height = "0px";
			self.mainContainer.style.overflow = "visible";
			self.setupThumbs();
			setTimeout(self.loadImages, 400);
		};
		
		//###########################################//
		/* resize and position */
		//##########################################//
		this.positionAndResize = function(w){
			self.stageWidth = w;
			self.positonThumbs();
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			self.mainContainer.style.width = self.stageWidth + "px";
			self.mainContainer.style.height = self.stageHeight + "px";
		};
		
		//##########################################//
		/* setup buttons */
		//##########################################//
		this.setupThumbs = function(){
		
			var thumb;
			for(var i=0; i<self.totalThumbnails; i++){
				FWDExamplePageGridThumb.setPrototype();
				thumb = new FWDExamplePageGridThumb(
						i,
						self.examplesThumbsBkColor_str);
				thumb.addListener(FWDExamplePageGridThumb.CLICK, self.thumbnailOnClickHandler);
				self.thumbs_ar[i] = thumb;
				self.addChild(thumb);
			}
		};
		
		this.thumbnailOnClickHandler = function(e){
			self.dispatchEvent(FWDExamplePageGrid.CLICK, {id:e.id});
		};
		
		
		//#############################################//
		/* load images */
		//#############################################//
		this.loadImages = function(){
			if(self.countLoadedThumbs > self.totalThumbnails-1) return;
			
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
			
			self.image_img = new Image();
			self.image_img.onerror = self.onImageLoadError;
			self.image_img.onload = self.onImageLoadComplete;
			
			self.image_img.src = self.paths_ar[self.countLoadedThumbs];
		};
		
		this.onImageLoadError = function(e){};
		
		this.onImageLoadComplete = function(e){
			var thumb = self.thumbs_ar[self.countLoadedThumbs];
			thumb.setImage(self.image_img, "graphics/over.png");
			self.countLoadedThumbs++;
			self.loadWithDelayId_to = setTimeout(self.loadImages, 40);	
		};
		
		//###################################################//
		/* position buttons */
		//###################################################//
		this.positonThumbs = function(){
			var thumb;
			var totalWidth;
			var curSet;
			var tempSet;
			var newX;
			var newY;
			var totalWidth;
			var totalHeight;
			var remainWidthSpace;
			var firsId;
			var lastId;
			var addToX;
			var currentLeftColId;
			var availableThumbsPerSection;
			
			this.remainWidthSpace = (self.stageWidth - totalWidth);
			
			var widthToResize = self.stageWidth;
			var heightToResize = self.stageHeight;
			
			self.howManyThumbsToDisplayH = Math.ceil((widthToResize - self.spacerH)/(self.thumbnailMaxWidth + self.spacerH));
			self.thumbW = Math.ceil(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			if(self.thumbW > self.thumbnailMaxWidth){
				self.howManyThumbsToDisplayH += 1;
				self.thumbW = Math.ceil(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			}
			
			self.thumbH = Math.floor((self.thumbW/self.thumbnailMaxWidth) * self.thumbnailMaxHeight);
		
			self.howManyThumbsToDisplayV = Math.ceil(self.totalThumbnails/self.howManyThumbsToDisplayH);
			if(self.howManyThumbsToDisplayV < 1) self.howManyThumbsToDisplayV = 1;
			
			totalWidth = (Math.min(self.howManyThumbsToDisplayH, self.totalThumbnails) * (self.thumbW + self.spacerH)) - self.spacerH;
			totalHeight = Math.min(Math.ceil(self.totalThumbnails/self.howManyThumbsToDisplayH), self.howManyThumbsToDisplayV) * (self.thumbH + self.spacerV) - self.spacerV;
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails){
				remainWidthSpace = 0;
			}else{
				remainWidthSpace = (widthToResize - totalWidth);
			}
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails) self.howManyThumbsToDisplayH = self.totalThumbnails;
			availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
		
			curSet = Math.floor(self.tempId / availableThumbsPerSection);
			currentLeftColId = self.howManyThumbsToDisplayH * curSet;
			
			firstId = curSet * availableThumbsPerSection;
			
			lastId = firstId + availableThumbsPerSection;
			if(lastId > self.totalThumbnails)  lastId = self.totalThumbnails;
			
			for (var i = 0; i<self.totalThumbnails; i++) {
				
				thumb = self.thumbs_ar[i];
				
				thumb.finalW = self.thumbW;
				if(i % self.howManyThumbsToDisplayH == self.howManyThumbsToDisplayH - 1) thumb.finalW += remainWidthSpace;
				thumb.finalH = self.thumbH;
				
				thumb.finalX = (i % self.howManyThumbsToDisplayH) * (self.thumbW + self.spacerH);
				thumb.finalX += Math.floor((i / availableThumbsPerSection)) * self.howManyThumbsToDisplayH * (self.thumbW + self.spacerH);
				thumb.finalX += (self.stageWidth - totalWidth)/2;
				thumb.finalX = Math.floor(thumb.finalX - currentLeftColId * (self.thumbW + self.spacerH));
				
				thumb.finalY = i % availableThumbsPerSection;
				thumb.finalY = Math.floor((thumb.finalY / self.howManyThumbsToDisplayH)) * (self.thumbH + self.spacerV);
				//thumb.finalY += (heightToResize - totalHeight)/2;
				thumb.finalY = Math.floor(thumb.finalY);
				
				thumb.resizeAndPosition();
				
			}
			self.stageHeight = (self.howManyThumbsToDisplayV * (self.thumbH  + self.spacerV)) - self.spacerV + 1;
		};
		
		this.disableAllPlayPauseButton = function(){
			for (var i = 0; i<self.totalThumbnails; i++) {
				self.thumbs_ar[i].disablePlayPauseButton();
			}
		};
	
	
		self.init();
	};
	
	/* set prototype */
	FWDExamplePageGrid.setPrototype = function(){
		FWDExamplePageGrid.prototype = new FWDMSPDisplayObject("div");
	};
	
	FWDExamplePageGrid.CLICK = "onClick";

	FWDExamplePageGrid.prototype = null;
	window.FWDExamplePageGrid = FWDExamplePageGrid;
}(window));/* FWDExamplePageGridThumb */
(function (window){
	
	var FWDExamplePageGridThumb = function(
			pId, 
			backgroundColor_str
		){
		
		var self = this;
		var prototype = FWDExamplePageGridThumb.prototype;
	
		this.imageHolder_do = null;
		this.normalImage_do = null;
		this.selectedImage_do = null;
		
		this.backgroundColor_str = backgroundColor_str;
		
		this.id = pId;
		this.imageOriginalW;
		this.imageOriginalH;
		this.finalX;
		this.finalY;
		this.finalW;
		this.finalH;
		this.imageFinalX;
		this.imageFinalY;
		this.imageFinalW;
		this.imageFinalH;
		this.progressPercent = 0;
		
		this.dispatchShowWithDelayId_to;
		
		this.isShowed_bl = false;
		this.hasImage_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.hasPointerEvent_bl = FWDMSPUtils.hasPointerEvent;

		this.init = function(){
			self.setOverflow("visible");
			//self.setBkColor(self.backgroundColor_str);
			self.setupMainContainers();
			self.setButtonMode(true);
			self.selectedImage_do = new FWDMSPDisplayObject("img");
			if(self.screen.addEventListener){
				self.screen.addEventListener("click", self.clickHandler);
				self.screen.addEventListener("mouseover", self.overHandler);
				self.screen.addEventListener("mouseout", self.outHandler);
			}else{
				self.screen.attachEvent("onclick", self.clickHandler);
			}
		};
		
		this.overHandler = function(){
			FWDAnimation.killTweensOf(self.selectedImage_do);
			self.selectedImage_do.setVisible(true);
			FWDAnimation.to(self.selectedImage_do, .3, {alpha:1});
		};
		
		this.outHandler = function(){
			FWDAnimation.killTweensOf(self.selectedImage_do);
			FWDAnimation.to(self.selectedImage_do, .3, {alpha:0, onComplete:function(){
				self.selectedImage_do.setVisible(false);
			}});
		};
		
		this.clickHandler = function(e){
			self.dispatchEvent(FWDExamplePageGridThumb.CLICK, {id:self.id});
		};
		
		//#################################//
		/* set image */
		//#################################//
		this.setupMainContainers = function(){
			self.imageHolder_do = new FWDMSPDisplayObject("div");
			self.addChild(self.imageHolder_do);
		};
	
		//#################################//
		/* set image */
		//#################################//
		this.setImage = function(image, overPath_str){
			self.normalImage_do = new FWDMSPDisplayObject("img");
			self.normalImage_do.setScreen(image);
			self.imageHolder_do.addChild(self.normalImage_do);
			
			self.imageOriginalW = self.normalImage_do.w;
			self.imageOriginalH = self.normalImage_do.h;
			
			if(!self.isMobile_bl){
				var selectedImage = new Image();
				selectedImage.src = overPath_str;
				self.selectedImage_do.setScreen(selectedImage);
				self.selectedImage_do.setAlpha(0);
				self.selectedImage_do.setVisible(false);
				self.imageHolder_do.addChild(self.selectedImage_do);
			}
			
			self.resizeImage();
			
			self.imageHolder_do.setX(parseInt(self.finalW/2));
			self.imageHolder_do.setY(parseInt(self.finalH/2));
			self.imageHolder_do.setWidth(0);
			self.imageHolder_do.setHeight(0);
			
			self.normalImage_do.setX(- parseInt(self.normalImage_do.w/2));
			self.normalImage_do.setY(- parseInt(self.normalImage_do.h/2));
			self.normalImage_do.setAlpha(0);
			
			FWDAnimation.to(self.imageHolder_do, .8, {
				x:0, 
				y:0,
				w:self.finalW,
				h:self.finalH, 
				ease:Expo.easeInOut});
			
			FWDAnimation.to(self.normalImage_do, .8, {
				alpha:1,
				x:self.imageFinalX, 
				y:self.imageFinalY, 
				ease:Expo.easeInOut});
		
			this.hasImage_bl = true;
			
			if(self.id == parent.id){
				self.disable();
			}
		};
		
		//#################################//
		/* resize thumbnail*/
		//#################################//
		this.resizeAndPosition = function(){
			
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.imageHolder_do);
			
			self.setX(self.finalX);
			self.setY(self.finalY);
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			self.imageHolder_do.setX(0);
			self.imageHolder_do.setY(0);
			self.imageHolder_do.setWidth(self.finalW);
			self.imageHolder_do.setHeight(self.finalH);
			
			self.resizeImage();
		};
	
		//#################################//
		/* resize image*/
		//#################################//
		this.resizeImage = function(animate){
			
			if(!self.normalImage_do) return;
			FWDAnimation.killTweensOf(self.normalImage_do);
			var scX = self.finalW/self.imageOriginalW;
			var scY = self.finalH/self.imageOriginalH;
			var ttsc;
			
			if(scX >= scY){
				ttsc = scX;
			}else{
				ttsc = scY;
			}
			
			self.imageFinalW = Math.ceil(ttsc * self.imageOriginalW);
			self.imageFinalH = Math.ceil(ttsc * self.imageOriginalH);
			self.imageFinalX = Math.round((self.finalW - self.imageFinalW)/2);
			self.imageFinalY = Math.round((self.finalH - self.imageFinalH)/2);
			
			self.normalImage_do.setX(self.imageFinalX);
			self.normalImage_do.setY(self.imageFinalY);
			self.normalImage_do.setWidth(self.imageFinalW);
			self.normalImage_do.setHeight(self.imageFinalH);
			
			if(self.selectedImage_do){
				self.selectedImage_do.setX(self.imageFinalX);
				self.selectedImage_do.setY(self.imageFinalY);
				self.selectedImage_do.setWidth(self.imageFinalW);
				self.selectedImage_do.setHeight(self.imageFinalH);
			}
	
			if(self.normalImage_do.alpha != 1) self.normalImage_do.setAlpha(1);
			
		};
	

		this.init();
	};
	
	/* set prototype */
	FWDExamplePageGridThumb.setPrototype = function(){
		FWDExamplePageGridThumb.prototype = new FWDMSPDisplayObject("div");
	};
	
	
	FWDExamplePageGridThumb.CLICK = "click";

	FWDExamplePageGridThumb.prototype = null;
	window.FWDExamplePageGridThumb = FWDExamplePageGridThumb;
}(window));var pageMenu_do;
var grid_do;
var exampleGrid_do;
var thumb;

var body_el;
var buyButton;
var td_els;
var mainHeader_el = null;
var menuHolder_el = null;
var mainProductHolder_el = null;
var productHolderBackground_el = null;
var whatIsMainText_el = null;
var logoImage_img = null;
var whyBuyImage_img = null;
var mainFeatureTableHolder_el = null;
var apiMainText_el = null;
var examplesMainText_el = null;
var col1_el = null;
var col2_el = null;
var byFWDMSP_img = null;
var specialNotes_el = null;
var gridHolder_el = null;
var examplesGrid_el = null;
var apiMain_el = null;
var apiLogger_el = null;
var apiButtonsHolder_el = null;
var textApiLogger_el = null;
var mspInstance = null;

var lightBoxViewer = null;
var openedWindow = null;

var separatorWidth = 980;
var mainWidth = 980;
var byFWDMSPImageWidth = 65;
var html5ImageWidth = 95;
var logoImageWidth = 421;
var productHolderWidth = 940;
var productHolderHeight = 550;
var whatIsImageWidth = 415;
var whyBuyImageWidth = 940;
var windowW = 0;
var windowH = 0;
var mainMenuId;
var secondMenuId;
var menuBackground;
var menuSeparator;
var button1NormalColor;
var button1SelectedColor;
var button2NormalColor;
var button2SelectedColor;
var apiPageThumbBkColor;
var isWhite_bl;

var resizeHandlerId_to;

function init(pId){
	if(window.top != window){
		top.location.href = 'index.html';	
	}else{
		if(pId == 0){
			mspInstance = "minimaldrk1";
			mainInit(0,0, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#FFFFFF", false);
		}else if(pId == 1){
			mspInstance = "moderndrk1";
			mainInit(1,0, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#FFFFFF", false);
		}else if(pId == 2){
			mspInstance = "classicdrk1";
			mainInit(2,0, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#FFFFFF", false);
		}else if(pId == 3){
			mspInstance = "metaldrk1";
			mainInit(3,0, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#FFFFFF", false);
		}else if(pId == 4){
			mspInstance = "minimalwh1";
			mainInit(0,1, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#000000", true);
		}else if(pId == 5){
			mspInstance = "modernwh1";
			mainInit(1,1, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#000000", true);
		}else if(pId == 6){
			mspInstance = "classicwh1";
			mainInit(2,1, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#000000", true);
		}else if(pId == 7){
			mspInstance = "metalwh1";
			mainInit(3,1, "#000000", "graphics/menu-button-separator.jpg", "#7a7a7a","#0099ff", "#FFFFFF", "#0099ff", "#000000", true);
		}
	}
}

function mainInit(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10){
	
	mainMenuId = p1;
	secondMenuId = p2;
	menuBackground = p3;
	menuSeparator = p4;
	button1NormalColor = p5;
	button1SelectedColor = p6;
	button2NormalColor = p7;
	button2SelectedColor = p8;
	apiPageThumbBkColor = p9;
	isWhite_bl = p10;
	
	body_el = document.getElementsByTagName("body")[0];
	td_els = document.getElementsByTagName("td"); 
	specialNotes_el = document.getElementById("specialNotes");
	whatIsMainText_el = document.getElementById("whatIsMainText");
	mainFeatureTableHolder_el  = document.getElementById("mainFeatureTableHolder");
	col1_el = document.getElementById("col1");
	col2_el = document.getElementById("col2");
	mainHeader_el = document.getElementById("mainHeader");
	menuHolder_el = document.getElementById("menuHolder");
	logoImage_img = document.getElementById("logoImage");
	apiMainText_el = document.getElementById("apiMainText");
	examplesMainText_el = document.getElementById("examplesMainText");
	whyBuyImage_img = document.getElementById("whyBuyImage");
	apiMain_el = document.getElementById("mainApi");
	apiLogger_el = document.getElementById("apiLogger");
	apiButtonsHolder_el = document.getElementById("apiButtonsHolder");
	textApiLogger_el = document.getElementById("textApiLogger");
	productHolderBackground_el = document.getElementById("productHolderBackground");
	gridHolder_el = document.getElementById("grid");
	examplesGrid_el = document.getElementById("examplesGrid");
	
	if(FWDMSPUtils.isMobile){
		document.getElementById("examplesWrapper").parentNode.removeChild(document.getElementById("examplesWrapper"));
		document.getElementById("apiWrapper").style.marginBottom = "5px";
	}	
	
	byFWD_img = document.getElementById("byFWD");
	setupByFWD();
	
	
	setupMenu();
	positionStuff();
	setTimeout( function(){
		positionStuff();
	}, 300);
	
	if(window.addEventListener){
		window.addEventListener("resize", onResizeHandler);
	}else if(window.attachEvent){
		window.attachEvent("onresize", onResizeHandler);
	}
	
	setupMSP();
	mspPlayer = window[mspInstance];
	
	mspPlayer.addListener(FWDMSP.START, playerStartHandler);
	mspPlayer.addListener(FWDMSP.PLAY, playerPlayHandler);
	mspPlayer.addListener(FWDMSP.PAUSE, playerPauseHandler);
	if(!FWDMSPUtils.isMobile) mspPlayer.addListener(FWDMSP.UPDATE, playerUpdateHandler);
	mspPlayer.addListener(FWDMSP.UPDATE_TIME, playerUpdateTimeHandler);
	mspPlayer.addListener(FWDMSP.POPUP, playerPopupHandler);
	mspPlayer.addListener(FWDMSP.STOP, playerStopHandler);
	
	addMessage("event listeners console...");
	mspPlayer.addListener(FWDMSP.ERROR, playerAPIErrorHandler);
	mspPlayer.addListener(FWDMSP.READY, playerAPIReadyHandler);
	mspPlayer.addListener(FWDMSP.START, startHandler);
	mspPlayer.addListener(FWDMSP.START_TO_LOAD_PLAYLIST, startToLoadPlalistHandler);	
	mspPlayer.addListener(FWDMSP.LOAD_PLAYLIST_COMPLETE, playListLoadCompleteHandler);	
	mspPlayer.addListener(FWDMSP.STOP, stopHandler);
	mspPlayer.addListener(FWDMSP.PLAY, playHandler);	
	mspPlayer.addListener(FWDMSP.PAUSE, pauseHandler);	
}

function setupByFWD(){
	byFWD_img.style.cursor = "pointer";
	byFWD_img.width = 45;
	byFWD_img.onclick = function(){
		window.open("http://www.webdesign-flash.ro", "_blank");
	};
	
	byFWD_img.onmouseover = function(){
		FWDAnimation.killTweensOf(byFWD_img);
		FWDAnimation.to(byFWD_img, 1, {scaleX:1.4, scaleY:1.4, ease:Elastic.easeOut, repeat:-1, repeatDelay:0.2})
	}
	
	byFWD_img.onmouseout = function(){
		FWDAnimation.killTweensOf(byFWD_img);
		FWDAnimation.to(byFWD_img, 1, {scaleX:1, scaleY:1, ease:Elastic.easeOut})
	}
}

function positionLogoImage(){
	var logoImageHeight = 132;
	
	var templogoImageWidth = Math.min(logoImageWidth, windowW);
	var logoImageHeight = (templogoImageWidth/logoImageWidth) * logoImageHeight;
	var logoImageX = parseInt((windowW - templogoImageWidth)/2);
	var logoImageY =  Math.round((176 - logoImageHeight)/2) - 14;
	
	logoImage_img.style.width = templogoImageWidth  + "px";
	logoImage_img.style.height = logoImageHeight  + "px";
	
	logoImage_img.style.left = logoImageX  + "px";
	logoImage_img.style.top =  logoImageY + "px";
	
	var byFWDX = logoImageX + templogoImageWidth - 55; 
	var btFWDY = logoImageY + logoImageHeight - (Math.round( 45 * (templogoImageWidth/logoImageWidth)))

	byFWD_img.style.left = byFWDX + "px";
	byFWD_img.style.top = btFWDY + "px"	
};

//########################################//
/* Setup buy button */
//########################################//
function setupBuyButton(){
	FWDBuyButton.setPrototype();
	buyButton = new FWDBuyButton("graphics/buy.png","graphics/hello.png", 70,70,30,60);
	buyButton.setX(0);
	body_el.appendChild(buyButton.screen);
	self.positionBuyButton();
	
}

function positionBuyButton(){
	if(buyButton){
		self.buyButton.setY(29);
	}
}

//#######################################//
/* API / GRID*/
//#######################################//
function playerStartHandler(){
	//if(FWDMSPUtils.isMobile) return;
	if(thumb){
		thumb.setButtonState(1);
		if(!FWDMSPUtils.isMobile) thumb.updateProgress(0);
		thumb.updateTime("00:00/00:00");
	}
	
	catId = mspPlayer.getCatId();
	trackId = mspPlayer.getTrackId();
	
	if(catId == 0 && trackId == 0){
		thumb = grid_do.thumbs_ar[0];
	}else if(catId == 0 && trackId == 1){
		thumb = grid_do.thumbs_ar[1];
	}else if(catId == 0 && trackId == 2){
		thumb = grid_do.thumbs_ar[2];
	}else if(catId == 0 && trackId == 3){
		thumb = grid_do.thumbs_ar[3];
	}else{
		thumb = null;
	}
};

function playerPlayHandler(){
	if(thumb) thumb.setButtonState(0);
};

function playerPauseHandler(){
	if(thumb) thumb.setButtonState(1);
};

function playerUpdateHandler(e){
	if(thumb){
		thumb.updateProgress(e.percent);
	}
};

function playerUpdateTimeHandler(e){
	if(thumb){
		thumb.updateTime(e.curTime + "/" + e.totalTime);
	}
};

function playerStopHandler(){
	if(thumb){
		thumb.setButtonState(1);
		if(!FWDMSPUtils.isMobile) thumb.updateProgress(0);
		thumb.updateTime("00:00/00:00");
	}
}

function playerPopupHandler(){
	if(thumb){
		thumb.setButtonState(1);
		if(!FWDMSPUtils.isMobile) thumb.updateProgress(0);
		thumb.updateTime("00:00/00:00");
	}
	disableAPIButtons();
	grid_do.disableAllPlayPauseButton();
};

//#####################################//
/* API logger */
//#####################################//
function playerAPIReadyHandler(){
	if(!FWDMSPUtils.isMobile){	
		setupExampleGrid();
	}
	
	setupAPIButtons();
	setupGrid();
	setupBuyButton();
	positionTextAndSeparators();
	addMessage("API ready!");
}

function playerAPIErrorHandler(e){
	addMessage("ERROR! : " + "<font color='#0099FF'>" + e.error + "</font>");
};

function startHandler(){
	addMessage("start to play track id: " + "<font color='#0099FF'>" + mspPlayer.getTrackId() + "</font>");
};

function startToLoadPlalistHandler(){
	addMessage("playlist start to load playlist id: " + "<font color='#0099FF'>" + mspPlayer.getCatId() + "</font>");
};

function playListLoadCompleteHandler(){
	addMessage("playlist load complete playlist id: " + "<font color='#0099FF'>" + mspPlayer.getCatId() + "</font>");
};

function stopHandler(){
	addMessage("stop");
};

function playHandler(){
	addMessage("play");
};

function pauseHandler(){
	addMessage("pause");
};

function setupAPIButtons(){
	
	FWDMSPAPIButton.setPrototype();
	stopButton = new FWDMSPAPIButton("stop", isWhite_bl);
	stopButton.getStyle().marginRight = "14px";
	stopButton.addListener(FWDMSPAPIButton.CLICK, stopClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	playButton = new FWDMSPAPIButton("play", isWhite_bl);
	playButton.getStyle().marginRight = "14px";
	playButton.addListener(FWDMSPAPIButton.CLICK, playClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	pauseButton = new FWDMSPAPIButton("pause", isWhite_bl);
	pauseButton.getStyle().marginRight = "14px";
	pauseButton.addListener(FWDMSPAPIButton.CLICK, pauseClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	addNewTrackButton = new FWDMSPAPIButton("add new track", isWhite_bl);
	addNewTrackButton.getStyle().marginRight = "14px";
	addNewTrackButton.addListener(FWDMSPAPIButton.CLICK, addNewTrackClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	playPrevButton = new FWDMSPAPIButton("play previous track", isWhite_bl);
	playPrevButton.getStyle().marginRight = "14px";
	playPrevButton.addListener(FWDMSPAPIButton.CLICK, playPrevClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	playNextButton = new FWDMSPAPIButton("play next track", isWhite_bl);
	playNextButton.getStyle().marginRight = "14px";
	playNextButton.addListener(FWDMSPAPIButton.CLICK, playNextClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	playShuffleButton = new FWDMSPAPIButton("play shuffle track", isWhite_bl);
	playShuffleButton.getStyle().marginRight = "14px";
	playShuffleButton.addListener(FWDMSPAPIButton.CLICK, playShuffleClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	scrubButton = new FWDMSPAPIButton("scrub to 50%", isWhite_bl);
	scrubButton.getStyle().marginRight = "14px";
	scrubButton.addListener(FWDMSPAPIButton.CLICK, scrubClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	setVolumeButton = new FWDMSPAPIButton("set volume to 100%", isWhite_bl);
	setVolumeButton.getStyle().marginRight = "14px";
	setVolumeButton.addListener(FWDMSPAPIButton.CLICK, setVolumeClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	showPlayerButton = new FWDMSPAPIButton("show player", isWhite_bl);
	showPlayerButton.getStyle().marginRight = "14px";
	showPlayerButton.addListener(FWDMSPAPIButton.CLICK, showPlayerHandler);
	
	FWDMSPAPIButton.setPrototype();
	hidePlayerButton = new FWDMSPAPIButton("hide player", isWhite_bl);
	hidePlayerButton.getStyle().marginRight = "14px";
	hidePlayerButton.addListener(FWDMSPAPIButton.CLICK, hidePlayerHandler);
	
	FWDMSPAPIButton.setPrototype();
	showPlaylistsButton = new FWDMSPAPIButton("show categories", isWhite_bl);
	showPlaylistsButton.getStyle().marginRight = "14px";
	showPlaylistsButton.addListener(FWDMSPAPIButton.CLICK, showPlaylistsClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	showPlaylistButton = new FWDMSPAPIButton("show playlist", isWhite_bl);
	showPlaylistButton.getStyle().marginRight = "14px";
	showPlaylistButton.addListener(FWDMSPAPIButton.CLICK, showPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	hidePlaylistButton = new FWDMSPAPIButton("hide playlist", isWhite_bl);
	hidePlaylistButton.getStyle().marginRight = "14px";
	hidePlaylistButton.addListener(FWDMSPAPIButton.CLICK, hidePlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	shareButton = new FWDMSPAPIButton("share", isWhite_bl);
	shareButton.getStyle().marginRight = "14px";
	shareButton.addListener(FWDMSPAPIButton.CLICK, shareClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	downloadButton = new FWDMSPAPIButton("download current track", isWhite_bl);
	downloadButton.getStyle().marginRight = "14px";
	downloadButton.addListener(FWDMSPAPIButton.CLICK, downloadClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	getApiReadyButton = new FWDMSPAPIButton("get API ready status", isWhite_bl);
	getApiReadyButton.getStyle().marginRight = "14px";
	getApiReadyButton.addListener(FWDMSPAPIButton.CLICK, getApiReadyClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	getCatIdButton = new FWDMSPAPIButton("get playlist id", isWhite_bl);
	getCatIdButton.getStyle().marginRight = "14px";
	getCatIdButton.addListener(FWDMSPAPIButton.CLICK, getCatIdClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	getTrackIdButton = new FWDMSPAPIButton("get track id", isWhite_bl);
	getTrackIdButton.getStyle().marginRight = "14px";
	getTrackIdButton.addListener(FWDMSPAPIButton.CLICK, getTrackIdClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	getTrackTitleButton = new FWDMSPAPIButton("get track title", isWhite_bl);
	getTrackTitleButton.getStyle().marginRight = "14px";
	getTrackTitleButton.addListener(FWDMSPAPIButton.CLICK, getTrackTitledClickHandler);

	FWDMSPAPIButton.setPrototype();
	loadHTMLPlaylistButton = new FWDMSPAPIButton("load HTML playlist - id:0", isWhite_bl);
	loadHTMLPlaylistButton.getStyle().marginRight = "14px";
	loadHTMLPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadHTMLPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadPodcastPlaylistButton = new FWDMSPAPIButton("load PODCAST playlist - id:1", isWhite_bl);
	loadPodcastPlaylistButton.getStyle().marginRight = "14px";
	loadPodcastPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadPodcastPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadSoundCloudPlaylistButton = new FWDMSPAPIButton("load SoundCloud playlist - id:2", isWhite_bl);
	loadSoundCloudPlaylistButton.getStyle().marginRight = "14px";
	loadSoundCloudPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadSoundCloundPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadMixedPlaylistButton = new FWDMSPAPIButton("load MIXED playlist - id:3", isWhite_bl);
	loadMixedPlaylistButton.getStyle().marginRight = "14px";
	loadMixedPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadMixedlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadXMLPlaylistButton = new FWDMSPAPIButton("load XML playlist - id:4", isWhite_bl);
	loadXMLPlaylistButton.getStyle().marginRight = "14px";
	loadXMLPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadXMLPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadYoutubePlaylistButton = new FWDMSPAPIButton("load Youtube playlist - id:5", isWhite_bl);
	loadYoutubePlaylistButton.getStyle().marginRight = "14px";
	loadYoutubePlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadYoutubePlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadMp4PlaylistButton = new FWDMSPAPIButton("load mp4 videos playlist - id:6", isWhite_bl);
	loadMp4PlaylistButton.getStyle().marginRight = "14px";
	loadMp4PlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadMp4PlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	loadFolderPlaylistButton = new FWDMSPAPIButton("load from folder playlist - id:7", isWhite_bl);
	loadFolderPlaylistButton.getStyle().marginRight = "14px";
	loadFolderPlaylistButton.addListener(FWDMSPAPIButton.CLICK, loadFolderMPlaylistClickHandler);
	
	FWDMSPAPIButton.setPrototype();
	popupPlayerButton = new FWDMSPAPIButton("popup player", isWhite_bl);
	popupPlayerButton.getStyle().marginRight = "14px";
	popupPlayerButton.addListener(FWDMSPAPIButton.CLICK, popupPlayerClickHandler);
	
	apiButtonsHolder_el.appendChild(stopButton.screen);
	apiButtonsHolder_el.appendChild(playButton.screen);
	apiButtonsHolder_el.appendChild(pauseButton.screen);
	apiButtonsHolder_el.appendChild(addNewTrackButton.screen);
	apiButtonsHolder_el.appendChild(playPrevButton.screen);
	apiButtonsHolder_el.appendChild(playNextButton.screen);
	apiButtonsHolder_el.appendChild(playShuffleButton.screen);
	apiButtonsHolder_el.appendChild(scrubButton.screen);
	apiButtonsHolder_el.appendChild(setVolumeButton.screen);
	apiButtonsHolder_el.appendChild(showPlaylistsButton.screen);
	apiButtonsHolder_el.appendChild(hidePlayerButton.screen);
	apiButtonsHolder_el.appendChild(showPlayerButton.screen);
	apiButtonsHolder_el.appendChild(showPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(hidePlaylistButton.screen);
	apiButtonsHolder_el.appendChild(shareButton.screen);
	apiButtonsHolder_el.appendChild(downloadButton.screen);
	apiButtonsHolder_el.appendChild(getApiReadyButton.screen);
	apiButtonsHolder_el.appendChild(getCatIdButton.screen);
	apiButtonsHolder_el.appendChild(getTrackIdButton.screen);
	apiButtonsHolder_el.appendChild(getTrackTitleButton.screen);
	apiButtonsHolder_el.appendChild(loadHTMLPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadPodcastPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadSoundCloudPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadMixedPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadXMLPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadYoutubePlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadMp4PlaylistButton.screen);
	apiButtonsHolder_el.appendChild(loadFolderPlaylistButton.screen);
	apiButtonsHolder_el.appendChild(popupPlayerButton.screen);
	apiButtonsHolder_el.appendChild(popupPlayerButton.screen);
}

function disableAPIButtons(){
	addNewTrackButton.disable();
	stopButton.disable();
	playButton.disable();
	pauseButton.disable();
	playPrevButton.disable();
	playNextButton.disable();
	playShuffleButton.disable();
	scrubButton.disable();
	setVolumeButton.disable();
	showPlaylistsButton.disable();
	hidePlayerButton.disable();
	showPlayerButton.disable();
	hidePlaylistButton.disable();
	showPlaylistButton.disable();
	shareButton.disable();
	downloadButton.disable();
	getApiReadyButton.disable();
	getCatIdButton.disable();
	getTrackIdButton.disable();
	getTrackTitleButton.disable();
	loadHTMLPlaylistButton.disable();
	loadPodcastPlaylistButton.disable();
	loadSoundCloudPlaylistButton.disable();
	loadXMLPlaylistButton.disable();
	loadMixedPlaylistButton.disable();
	loadFolderPlaylistButton.disable();
	loadYoutubePlaylistButton.disable();
	loadMp4PlaylistButton.disable();
	popupPlayerButton.disable();
};

function stopClickHandler(){
	mspPlayer.stop();
};

function addNewTrackClickHandler(){
	mspPlayer.addTrack("content/mp3/01.mp3", "<span style='font-weight:bold'>New added track</span> - new added artist", "content/thumbnails/brian.jpg", "06:16", true);
}

function playClickHandler(){
	mspPlayer.play();
}

function pauseClickHandler(){
	mspPlayer.pause();
}

function playPrevClickHandler(){
	mspPlayer.playPrev();
}

function playNextClickHandler(){
	mspPlayer.playNext();
}

function playShuffleClickHandler(){
	mspPlayer.playShuffle();
}

function scrubClickHandler(){
	mspPlayer.scrub(.5);
};

function setVolumeClickHandler(){
	mspPlayer.setVolume(1);
};

function showPlayerHandler(){
	mspPlayer.showPlayer();
};

function hidePlayerHandler(){
	mspPlayer.hidePlayer();
};

function showPlaylistsClickHandler(){
	mspPlayer.showCategories();
};

function showPlaylistClickHandler(){
	mspPlayer.showPlaylist();
};

function hidePlaylistClickHandler(){
	mspPlayer.hidePlaylist();
};

function shareClickHandler(){
	mspPlayer.share();
};

function downloadClickHandler(){
	mspPlayer.downloadMP3();
}

function getApiReadyClickHandler(){
	addMessage("API ready status : " + "<font color='#0099FF'>" + mspPlayer.getIsAPIReady() + "</font>");
};

function getCatIdClickHandler(){
	addMessage("get playlist id: " + "<font color='#0099FF'>" + mspPlayer.getCatId() + "</font>");
};

function getTrackIdClickHandler(){
	addMessage("get track id: " + "<font color='#0099FF'>" + mspPlayer.getTrackId() + "</font>");
};

function getTrackTitledClickHandler(){
	addMessage("track title: " + mspPlayer.getTrackTitle());
};


function loadHTMLPlaylistClickHandler(){
	mspPlayer.loadPlaylist(0);
};

function loadPodcastPlaylistClickHandler(){
	mspPlayer.loadPlaylist(1);
};

function loadSoundCloundPlaylistClickHandler(){
	mspPlayer.loadPlaylist(2);
};

function loadMixedlaylistClickHandler(){
	mspPlayer.loadPlaylist(3);
}

function loadXMLPlaylistClickHandler(){
	mspPlayer.loadPlaylist(4);
}

function loadYoutubePlaylistClickHandler(){
	mspPlayer.loadPlaylist(5);
}

function loadMp4PlaylistClickHandler(){
	mspPlayer.loadPlaylist(6);
}

function loadFolderMPlaylistClickHandler(){
	mspPlayer.loadPlaylist(7);
}

function popupPlayerClickHandler(){
	disableAPIButtons();
	mspPlayer.popup();
};

function addMessage(message){
	var currentInnerHTML = textApiLogger_el.innerHTML + message + "<br>";
	textApiLogger_el.innerHTML = currentInnerHTML;  
	var top = -(textApiLogger_el.offsetHeight -  apiLogger_el.offsetHeight);
	if(top > 0) top = 0;
	setTimeout(function(){
		self.textApiLogger_el.style.top = top + "px";
	});
};


//#####################################//
/* Setup menu */
//####################################//
function setupMenu(){
	
	FWDPageMenu.setPrototype();
	pageMenu_do = new FWDPageMenu({
		disabledButton:0,
		parent:menuHolder_el,
		menuLabels:["MINIMAL DARK, MINIMAL WHITE", "MODERN DARK, MODERN WHITE", "CLASSIC DARK, CLASSIC WHITE", "METAL DARK, METAL WHITE", "<span style='color:#FF0000;'>H</span><span style='color:#00FF00;'>E</span><span style='color:#0099FF;'>X</span> COLORS"],
		buttonSeparatorPath:menuSeparator,
		button1NormalColor:button1NormalColor,
		button1SelectedColor:button1SelectedColor,
		button2NormalColor:button2NormalColor,
		button2SelectedColor:button2SelectedColor,
		backgroundColorOrPath:menuBackground,
		spacerColor:"#cccccc"
	});
	
	
	pageMenu_do.disableButton(mainMenuId, secondMenuId);
	pageMenu_do.addListener(FWDPageMenuButton.CLICK, clickHandler);
}

function clickHandler(e){

	if(e.mainButtonId == 0 && e.buttonId == 0){
		window.location.href = "index.html";
	}else if(e.mainButtonId == 0 && e.buttonId == 1){
		window.location.href = "minimal-white.html";
	}else if(e.mainButtonId == 1 && e.buttonId == 0){
		window.location.href = "modern-dark.html";
	}else if(e.mainButtonId == 1 && e.buttonId == 1){
		window.location.href = "modern-white.html";
	}else if(e.mainButtonId == 2 && e.buttonId == 0){
		window.location.href = "clasic-dark.html";
	}else if(e.mainButtonId == 2 && e.buttonId == 1){
		window.location.href = "clasic-white.html";
	}else if(e.mainButtonId == 3 && e.buttonId == 0){
		window.location.href = "metal-dark.html";
	}else if(e.mainButtonId == 3 && e.buttonId == 1){
		window.location.href = "metal-white.html";
	}else if(e.mainButtonId == 4){
		window.location.href = "hex.html";
	}
};

//#####################################//
/* Setup grid */
//#####################################//
function setupGrid(){
	FWDMSPPageGrid.setPrototype();
	grid_do = new FWDMSPPageGrid({
		mainContainer:gridHolder_el,
		bkColor:apiPageThumbBkColor,
		isWhite:isWhite_bl
	});

	gridHolder_el.appendChild(grid_do.screen);
	grid_do.addListener(FWDMSPPageGrid.SCRUB, gridScrubHandler);
	grid_do.addListener(FWDMSPPageGrid.PLAY, gridPlayHandler);
	grid_do.addListener(FWDMSPPageGrid.PAUSE, gridPuseHandler);
}

function gridPlayHandler(e){

	if(thumb && e.thumbId == trackId){
		mspPlayer.play();
	}else{
		if(e.thumbId == 0){
			mspPlayer.playSpecificTrack(0,0);
		}else if(e.thumbId == 1){
			mspPlayer.playSpecificTrack(0,1);
		}else if(e.thumbId == 2){
			mspPlayer.playSpecificTrack(0,2);
		}else if(e.thumbId == 3){
			mspPlayer.playSpecificTrack(0,3);
		}
	}
};

function gridPuseHandler(e){
	if(thumb){
		mspPlayer.pause();
	}
};

function gridScrubHandler(e){
	mspPlayer.scrub(e.percent);
};

//######################################//
/* Setup example grid */
//#####################################//
function setupExampleGrid(){
	FWDExamplePageGrid.setPrototype();
	exampleGrid_do = new FWDExamplePageGrid({
			mainContainer:examplesGrid_el,
			examplesThumbsBkColor:apiPageThumbBkColor,
			isWhite:isWhite_bl
			});
	examplesGrid_el.appendChild(exampleGrid_do.screen);
	exampleGrid_do.addListener(FWDExamplePageGrid.CLICK, gridExampleClickHandler);
}

function gridExampleClickHandler(e){
	if(mainMenuId == 0 && secondMenuId == 0){
		if(e.id == 0){
			window.open("mindrk-top.html", "_blank");
		}else if(e.id == 1){
			window.open("mindrk-op.html", "_blank");
		}else if(e.id == 2){
			window.open("mindrk-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("mindrk-simple.html", "_blank");
		}
	}else if(mainMenuId == 0 && secondMenuId == 1){
		if(e.id == 0){
			window.open("minwh-top.html", "_blank");
		}else if(e.id == 1){
			window.open("minwh-op.html", "_blank");
		}else if(e.id == 2){
			window.open("minwh-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("minwh-simple.html", "_blank");
		}
	}else if(mainMenuId == 1 && secondMenuId == 0){
		if(e.id == 0){
			window.open("mdrkdrk-top.html", "_blank");
		}else if(e.id == 1){
			window.open("mdrkdrk-op.html", "_blank");
		}else if(e.id == 2){
			window.open("mdrkdrk-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("mdrkdrk-simple.html", "_blank");
		}
	}else if(mainMenuId == 1 && secondMenuId == 1){
		if(e.id == 0){
			window.open("mdrnwh-top.html", "_blank");
		}else if(e.id == 1){
			window.open("mdrnwh-op.html", "_blank");
		}else if(e.id == 2){
			window.open("mdrnwh-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("mdrnwh-simple.html", "_blank");
		}
	}else if(mainMenuId == 2 && secondMenuId == 0){
		if(e.id == 0){
			window.open("clsdrk-top.html", "_blank");
		}else if(e.id == 1){
			window.open("clsdrk-op.html", "_blank");
		}else if(e.id == 2){
			window.open("clsdrk-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("clsdrk-simple.html", "_blank");
		}
	}else if(mainMenuId == 2 && secondMenuId == 1){
		if(e.id == 0){
			window.open("clswh-top.html", "_blank");
		}else if(e.id == 1){
			window.open("clswh-op.html", "_blank");
		}else if(e.id == 2){
			window.open("clswh-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("clswh-simple.html", "_blank");
		}
	}else if(mainMenuId == 3 && secondMenuId == 0){
		if(e.id == 0){
			window.open("metdrk-top.html", "_blank");
		}else if(e.id == 1){
			window.open("metdrk-op.html", "_blank");
		}else if(e.id == 2){
			window.open("metdrk-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("metdrk-simple.html", "_blank");
		}
	}else if(mainMenuId == 3 && secondMenuId == 1){
		if(e.id == 0){
			window.open("metwh-top.html", "_blank");
		}else if(e.id == 1){
			window.open("metwh-op.html", "_blank");
		}else if(e.id == 2){
			window.open("metwh-hd.html", "_blank");
		}else if(e.id == 3){
			window.open("metwh-simple.html", "_blank");
		}
	}
}

//#####################################//
/* resize handler */
//#####################################//
function onResizeHandler(){
	positionStuff();
	setTimeout(positionStuff, 50);
}

//#####################################//
/* position stuff */
//#####################################//
function positionStuff(){
	windowW = menuHolder_el.offsetWidth;
	pageMenu_do.positionAndResize(windowW);
	positionLogoImage();
	positionTextAndSeparators();
	positionBuyButton();
}

function positionTextAndSeparators(){

	var whatIsMainTextWidth = Math.min(mainWidth - 20, windowW - 20);
	var whatIsMainTextX = parseInt((windowW - whatIsMainTextWidth)/2);
	var colWidth = parseInt((Math.min(mainWidth, windowW) - 40)/2);
	var colHolderWidth = parseInt((Math.min(mainWidth, windowW) - 20));
	
	if(grid_do){
		self.gridHolder_el.style.left = whatIsMainTextX + "px";
		grid_do.positionAndResize(whatIsMainTextWidth - 4);
	}	
	
	if(exampleGrid_do){
		self.examplesGrid_el.style.left = whatIsMainTextX + "px";
		exampleGrid_do.positionAndResize(whatIsMainTextWidth);
	}	
	
	whatIsMainText_el.style.left = whatIsMainTextX  + "px";
	whatIsMainText_el.style.width = (whatIsMainTextWidth )  + "px";
	mainFeatureTableHolder_el.style.width = colHolderWidth + "px";
	
	apiMainText_el.style.left = whatIsMainTextX  + "px";
	apiMainText_el.style.width = (whatIsMainTextWidth )  + "px";
	
	examplesMainText_el.style.left = whatIsMainTextX  + "px";
	examplesMainText_el.style.width = (whatIsMainTextWidth )  + "px";
	
	specialNotes_el.style.left = whatIsMainTextX + "px";
	specialNotes_el.style.width = whatIsMainTextWidth + "px";
	
	apiMain_el.style.left = whatIsMainTextX + "px";
	apiMain_el.style.width = whatIsMainTextWidth + "px"; 
	
	var totalWidth = Math.min(mainWidth, windowW);
	var loggerWidth = parseInt((totalWidth/2) - 10);
	var loggerHeight = (apiButtonsHolder_el.offsetHeight - 12);
	if(FWDMSPUtils.isSafari) loggerHeight += 6;

	var butHoldersW = loggerWidth;
	var butHoldersX =  parseInt(totalWidth - loggerWidth - 10);
	
	if(windowW > 650){
		apiButtonsHolder_el.style.left = butHoldersX + "px";
		apiButtonsHolder_el.style.top = "0px";
		apiButtonsHolder_el.style.width = butHoldersW + "px";		
		apiButtonsHolder_el.style.marginTop = "0px";

		apiLogger_el.style.position = "absolute";
		apiLogger_el.style.width = loggerWidth + "px";		
		if(!isNaN(loggerHeight) && loggerHeight > 0) apiLogger_el.style.height = loggerHeight + "px";
	}else{
		apiLogger_el.style.position = "relative";
		apiButtonsHolder_el.style.left = "0px";
		apiButtonsHolder_el.style.top = "0px";
		apiButtonsHolder_el.style.width = "100%";
		apiButtonsHolder_el.style.marginTop = "10px";
		
		apiLogger_el.style.width = windowW + "px";		
		apiLogger_el.style.height = "300px";
		apiLogger_el.style.marginTop = "0px";
		apiLogger_el.style.marginBottom = "0px";
	}
	
	for(var i=0; i<td_els.length; i++){
		if(windowW < 500){
			td_els[i].style.display = "block";
			if(i == 1){
				td_els[i].style.width = "0%";
			}else{
				td_els[i].style.width = "100%";
			}
			td_els[i].style.display = "block";
		}else{
			if(i == 0){
				td_els[i].style.width = "47%";
				td_els[i].style.display = "table-cell";
			}else if(i == 1){
				td_els[i].style.width = "6%";
				td_els[i].style.display = "table-cell";
			}else{
				td_els[i].style.width = "47%";
				td_els[i].style.display = "table-cell";
			}
		}
	}
}

/* FWDMSPPageComplexButton */
(function (){
var FWDMSPPageComplexButton = function(
			n1ImgPath, 
			s1ImgPath, 
			n2ImgPath, 
			s2ImgPath, 
			buttonWidth,
			buttonHeight,
			disptachMainEvent_bl
		){
		
		var self = this;
		var prototype = FWDMSPPageComplexButton.prototype;
		
		this.n1Img = new Image();
		this.n1Img.src = n1ImgPath;
		this.s1Img = new Image();
		this.s1Img.src = s1ImgPath;
		this.n2Img = new Image();
		this.n2Img.src = n2ImgPath;
		this.s2Img = new Image();
		this.s2Img.src = s2ImgPath;
		
		this.firstButton_do;
		this.n1_do;
		this.s1_do;
		this.secondButton_do;
		this.n2_do;
		this.s2_do;
		
		this.buttonWidth = buttonWidth;
		this.buttonHeight = buttonHeight;
		
		this.isSelectedState_bl = false;
		this.currentState = 1;
		this.disptachMainEvent_bl = disptachMainEvent_bl;
		this.isDisabled_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.hasPointerEvent_bl = FWDMSPUtils.hasPointerEvent;
		
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.hasTransform2d_bl = false;
			self.setButtonMode(true);
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setupMainContainers();
			self.secondButton_do.setVisible(false);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.firstButton_do = new FWDMSPDisplayObject("div");
			self.addChild(self.firstButton_do);
			self.n1_do = new FWDMSPDisplayObject("img");	
			self.n1_do.setScreen(self.n1Img);
			self.n1_do.setWidth(self.buttonWidth);
			self.n1_do.setHeight(self.buttonHeight);
		
			self.s1_do = new FWDMSPDisplayObject("img");
			self.s1_do.setScreen(self.s1Img);
			self.s1_do.setWidth(self.buttonWidth);
			self.s1_do.setHeight(self.buttonHeight);
			self.s1_do.setAlpha(0);
			
			self.firstButton_do.addChild(self.n1_do);
			self.firstButton_do.addChild(self.s1_do);
			self.firstButton_do.setWidth(self.buttonWidth);
			self.firstButton_do.setHeight(self.buttonHeight);
			
			self.secondButton_do = new FWDMSPDisplayObject("div");
			self.addChild(self.secondButton_do);
			self.n2_do = new FWDMSPDisplayObject("img");	
			self.n2_do.setScreen(self.n2Img);
			self.n2_do.setWidth(self.buttonWidth);
			self.n2_do.setHeight(self.buttonHeight);
			
			self.s2_do = new FWDMSPDisplayObject("img");
			self.s2_do.setScreen(self.s2Img);
			self.s2_do.setAlpha(0);
			self.s2_do.setWidth(self.buttonWidth);
			self.s2_do.setHeight(self.buttonHeight);
			
			self.secondButton_do.addChild(self.n2_do);
			self.secondButton_do.addChild(self.s2_do);
			self.secondButton_do.setWidth(self.buttonWidth);
			self.secondButton_do.setHeight(self.buttonHeight);
			
			self.addChild(self.secondButton_do);
			self.addChild(self.firstButton_do);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
					self.screen.addEventListener("touchstart", self.onDown);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mousedown", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e, animate){
			if(self.isDisabled_bl || self.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.dispatchEvent(FWDMSPPageComplexButton.MOUSE_OVER, {e:e});
				self.setSelectedState(true);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl || !self.isSelectedState_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				self.setNormalState();
				self.dispatchEvent(FWDMSPPageComplexButton.MOUSE_OUT);
			}
		};
		
		self.onDown = function(e){
			if(e.preventDefault) e.preventDefault();
		};
	
		self.onMouseUp = function(e){
			if(self.isDisabled_bl || e.button == 2) return;
			if(e.preventDefault) e.preventDefault();
			if(!self.isMobile_bl) self.onMouseOver(e, false);
			//if(self.hasPointerEvent_bl) self.setNormalState();
			if(self.disptachMainEvent_bl) self.dispatchEvent(FWDMSPPageComplexButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		/* toggle button */
		//#############################//
		self.toggleButton = function(){
			if(self.currentState == 1){
				self.firstButton_do.setVisible(false);
				self.secondButton_do.setVisible(true);
				self.currentState = 0;
				self.dispatchEvent(FWDMSPPageComplexButton.FIRST_BUTTON_CLICK);
			}else{
				self.firstButton_do.setVisible(true);
				self.secondButton_do.setVisible(false);
				self.currentState = 1;
				self.dispatchEvent(FWDMSPPageComplexButton.SECOND_BUTTON_CLICK);
			}
		};
		
		//##############################//
		/* set second buttons state */
		//##############################//
		self.setButtonState = function(state){
			if(state == 1){
				self.firstButton_do.setVisible(true);
				self.secondButton_do.setVisible(false);
				self.currentState = 1; 
			}else{
				self.firstButton_do.setVisible(false);
				self.secondButton_do.setVisible(true);
				self.currentState = 0; 
			}
		};
		
		//###############################//
		/* set normal state */
		//################################//
		this.setNormalState = function(){
			if(self.isMobile_bl && !self.hasPointerEvent_bl) return;
			self.isSelectedState_bl = false;
			FWDAnimation.killTweensOf(self.s1_do);
			FWDAnimation.killTweensOf(self.s2_do);
			FWDAnimation.to(self.s1_do, .5, {alpha:0, ease:Expo.easeOut});	
			FWDAnimation.to(self.s2_do, .5, {alpha:0, ease:Expo.easeOut});
		};
		
		this.setSelectedState = function(animate){
			self.isSelectedState_bl = true;
			FWDAnimation.killTweensOf(self.s1_do);
			FWDAnimation.killTweensOf(self.s2_do);
			FWDAnimation.to(self.s1_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
			FWDAnimation.to(self.s2_do, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		
		//#####################################//
		/* disable / enable */
		//#####################################//
		this.disable = function(){
			self.isDisabled_bl = true;
			self.setButtonMode(false);
			self.setAlpha(.2);
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.setButtonMode(true);
			self.setAlpha(.1);
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDMSPPageComplexButton.setPrototype = function(){
		FWDMSPPageComplexButton.prototype = new FWDMSPDisplayObject("div");
	};
	
	FWDMSPPageComplexButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDMSPPageComplexButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDMSPPageComplexButton.MOUSE_OVER = "onMouseOver";
	FWDMSPPageComplexButton.MOUSE_OUT = "onMouseOut";
	FWDMSPPageComplexButton.MOUSE_UP = "onMouseUp";
	FWDMSPPageComplexButton.CLICK = "onClick";
	
	FWDMSPPageComplexButton.prototype = null;
	window.FWDMSPPageComplexButton = FWDMSPPageComplexButton;
}(window));/* FWDMSPPageGrid */
(function (window){
var FWDMSPPageGrid = function(props_obj){
		
		var self = this;
		var prototype = FWDMSPPageGrid.prototype;
		
		this.image_img = null;
		this.mainContainer = props_obj.mainContainer;
		this.bkColor = props_obj.bkColor;
		this.apiPlaylistTitleColor_str = props_obj.apiPlaylistTitleColor_str;
		
		this.thumbs_ar = [];
		
		
		this.paths_ar = [
		       "content/thumbnails/track1.jpg",
		       "content/thumbnails/track2.jpg",
		       "content/thumbnails/track3.jpg",
		       "content/thumbnails/track4.jpg"  
		    ];
		
		if(!props_obj.isWhite){
			this.text_ar = [
			   "<p style='margin-top:0px; color:#000000'>Playlist 1</p><p style='color:#888888; margin-top:4px;'>Track 1</p>",
			   "<p style='margin-top:0px; color:#000000'>Playlist 1</p><p style='color:#888888; margin-top:4px;'>Track 2</p>",
			   "<p style='margin-top:0px; color:#000000'>Playlist 1</p><p style='color:#888888; margin-top:4px;'>Track 3</p>",
			   "<p style='margin-top:0px; color:#000000'>Playlist 1</p><p style='color:#888888; margin-top:4px;'>Track 4</p>",
			];
		}else{
			this.text_ar = [
			   "<p style='margin-top:0px; color:#FFFFFF'>Playlist 1</p><p style='color:#999999; margin-top:4px;'>Track 1</p>",
			   "<p style='margin-top:0px; color:#FFFFFF'>Playlist 1</p><p style='color:#999999; margin-top:4px;'>Track 2</p>",
			   "<p style='margin-top:0px; color:#FFFFFF'>Playlist 1</p><p style='color:#999999; margin-top:4px;'>Track 3</p>",
			   "<p style='margin-top:0px; color:#FFFFFF'>Playlist 1</p><p style='color:#999999; margin-top:4px;'>Track 4</p>",
			];
		}
		
	

		this.id = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.dif = 0;
		this.tempId = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.thumbW = 0;
		this.thumbH = 0;
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.thumbnailMaxWidth = 225;
		this.thumbnailMaxHeight = 191;
		this.spacerH = 20;
		this.spacerV = 80;
		this.howManyThumbsToDisplayH = 0;
		this.howManyThumbsToDisplayV = 0;
		this.totalThumbnails = this.paths_ar.length;
		this.delayRate = .06;
		this.countLoadedThumbs = 0;
		
		this.reverse_bl = props_obj.isWhite;
	
		this.hideCompleteId_to;
		this.showCompleteId_to;
		this.loadThumbnailsId_to;
		
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.mainContainer.style.height = "0px";
			self.setupThumbs();
			setTimeout(self.loadImages, 400);
		};
		
		//###########################################//
		/* resize and position */
		//##########################################//
		this.positionAndResize = function(w){
			self.stageWidth = w;
			self.positonThumbs();
			
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			self.mainContainer.style.width = self.stageWidth + "px";
			self.mainContainer.style.height = self.stageHeight + "px";
		};
		
		//##########################################//
		/* setup buttons */
		//##########################################//
		this.setupThumbs = function(){
		
			var thumb;
			for(var i=0; i<self.totalThumbnails; i++){
				FWDMSPPageGridThumb.setPrototype();
				thumb = new FWDMSPPageGridThumb(
						i,
						self.bkColor,
						self.apiPlaylistTitleColor_str,
						self.text_ar[i],
						self.reverse_bl);
				thumb.addListener(FWDMSPPageGridThumb.MOUSE_UP, self.thumbnailOnMouseUpHandler);
				thumb.addListener(FWDMSPPageGridThumb.SCRUB, self.thumbnailOnScrubHandler);
				self.thumbs_ar[i] = thumb;
				self.addChild(thumb);
			}
		};
		
		this.thumbnailOnMouseUpHandler = function(e){
			if(e.buttonState == 1){
				self.dispatchEvent(FWDMSPPageGrid.PLAY, {thumbId:e.thumbId});
			}else{
				self.dispatchEvent(FWDMSPPageGrid.PAUSE,  {thumbId:e.thumbId});
			}
		};
		this.thumbnailOnScrubHandler = function(e){
			self.dispatchEvent(FWDMSPPageGrid.SCRUB, {percent:e.percent});
		};
		
		//#############################################//
		/* load images */
		//#############################################//
		this.loadImages = function(){
			if(self.countLoadedThumbs > self.totalThumbnails-1) return;
			
			if(self.image_img){
				self.image_img.onload = null;
				self.image_img.onerror = null;
			}
			
			self.image_img = new Image();
			self.image_img.onerror = self.onImageLoadError;
			self.image_img.onload = self.onImageLoadComplete;
			
			self.image_img.src = self.paths_ar[self.countLoadedThumbs];
		};
		
		this.onImageLoadError = function(e){};
		
		this.onImageLoadComplete = function(e){
			var thumb = self.thumbs_ar[self.countLoadedThumbs];
			thumb.setImage(self.image_img);
			self.countLoadedThumbs++;
			self.loadWithDelayId_to = setTimeout(self.loadImages, 40);	
		};
		
		//###################################################//
		/* position buttons */
		//###################################################//
		this.positonThumbs = function(){
			var thumb;
			var totalWidth;
			var curSet;
			var tempSet;
			var newX;
			var newY;
			var totalWidth;
			var totalHeight;
			var remainWidthSpace;
			var firsId;
			var lastId;
			var addToX;
			var currentLeftColId;
			var availableThumbsPerSection;
			
			this.remainWidthSpace = (self.stageWidth - totalWidth);
			
			var widthToResize = self.stageWidth;
			var heightToResize = self.stageHeight;
			
			self.howManyThumbsToDisplayH = Math.ceil((widthToResize - self.spacerH)/(self.thumbnailMaxWidth + self.spacerH));
			self.thumbW = Math.floor(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			if(self.thumbW > self.thumbnailMaxWidth){
				self.howManyThumbsToDisplayH += 1;
				self.thumbW = Math.floor(((widthToResize - self.spacerH * (self.howManyThumbsToDisplayH - 1)))/self.howManyThumbsToDisplayH);
			}
			
			self.thumbH = Math.floor((self.thumbW/self.thumbnailMaxWidth) * self.thumbnailMaxHeight);
			
			self.howManyThumbsToDisplayV = Math.ceil(self.totalThumbnails/self.howManyThumbsToDisplayH);
			if(self.howManyThumbsToDisplayV < 1) self.howManyThumbsToDisplayV = 1;
			
			totalWidth = (Math.min(self.howManyThumbsToDisplayH, self.totalThumbnails) * (self.thumbW + self.spacerH)) - self.spacerH;
			totalHeight = Math.min(Math.ceil(self.totalThumbnails/self.howManyThumbsToDisplayH), self.howManyThumbsToDisplayV) * (self.thumbH + self.spacerV) - self.spacerV;
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails){
				remainWidthSpace = 0;
			}else{
				remainWidthSpace = (widthToResize - totalWidth);
			}
			
			if(self.howManyThumbsToDisplayH > self.totalThumbnails) self.howManyThumbsToDisplayH = self.totalThumbnails;
			availableThumbsPerSection = (self.howManyThumbsToDisplayH * self.howManyThumbsToDisplayV);
		
			curSet = Math.floor(self.tempId / availableThumbsPerSection);
			currentLeftColId = self.howManyThumbsToDisplayH * curSet;
			
			firstId = curSet * availableThumbsPerSection;
			
			lastId = firstId + availableThumbsPerSection;
			if(lastId > self.totalThumbnails)  lastId = self.totalThumbnails;
			
			for (var i = 0; i<self.totalThumbnails; i++) {
				
				thumb = self.thumbs_ar[i];
				
				thumb.finalW = self.thumbW;
				if(i % self.howManyThumbsToDisplayH == self.howManyThumbsToDisplayH - 1) thumb.finalW += remainWidthSpace;
				thumb.finalH = self.thumbH;
				
				thumb.finalX = (i % self.howManyThumbsToDisplayH) * (self.thumbW + self.spacerH);
				thumb.finalX += Math.floor((i / availableThumbsPerSection)) * self.howManyThumbsToDisplayH * (self.thumbW + self.spacerH);
				thumb.finalX += (self.stageWidth - totalWidth)/2;
				thumb.finalX = Math.floor(thumb.finalX - currentLeftColId * (self.thumbW + self.spacerH));
				
				thumb.finalY = i % availableThumbsPerSection;
				thumb.finalY = Math.floor((thumb.finalY / self.howManyThumbsToDisplayH)) * (self.thumbH + self.spacerV);
				//thumb.finalY += (heightToResize - totalHeight)/2;
				thumb.finalY = Math.floor(thumb.finalY);
				
				thumb.resizeAndPosition();
				
			}
			self.stageHeight = (self.howManyThumbsToDisplayV * (self.thumbH  + self.spacerV)) - 30;
		};
		
		this.disableAllPlayPauseButton = function(){
			for (var i = 0; i<self.totalThumbnails; i++) {
				self.thumbs_ar[i].disablePlayPauseButton();
			}
		};
	
	
		self.init();
	};
	
	/* set prototype */
	FWDMSPPageGrid.setPrototype = function(){
		FWDMSPPageGrid.prototype = new FWDMSPDisplayObject("div");
	};
	
	FWDMSPPageGrid.SCRUB = "scrub";
	FWDMSPPageGrid.CLICK = "onClick";
	FWDMSPPageGrid.PLAY = "play";
	FWDMSPPageGrid.PAUSE = "pause";
	

	FWDMSPPageGrid.prototype = null;
	window.FWDMSPPageGrid = FWDMSPPageGrid;
}(window));/* FWDMSPPageGridThumb */
(function (window){
	
	var FWDMSPPageGridThumb = function(
			pId, 
			backgroundColor_str,
			apiPlaylistTitleColor_str,
			htmlContent, 
			reverse
		){
		
		var self = this;
		var prototype = FWDMSPPageGridThumb.prototype;
	
		this.htmlContent = htmlContent;
		
		this.pButton_do = null;
		this.simpleText_do = null;
		this.imageHolder_do = null;
		this.normalImage_do = null;
		this.progress_do = null;
		this.time_do = null;
		this.dumy_do = null;
		
		this.backgroundColor_str = backgroundColor_str;
		this.apiPlaylistTitleColor_str = apiPlaylistTitleColor_str;
		
		this.id = pId;
		this.imageOriginalW;
		this.imageOriginalH;
		this.finalX;
		this.finalY;
		this.finalW;
		this.finalH;
		this.imageFinalX;
		this.imageFinalY;
		this.imageFinalW;
		this.imageFinalH;
		this.progressPercent = 0;
		
		this.dispatchShowWithDelayId_to;
	
		this.isShowed_bl = false;
		this.hasImage_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.hasPointerEvent_bl = FWDMSPUtils.hasPointerEvent;

		this.init = function(){
			self.setOverflow("visible");
			self.setBkColor(self.backgroundColor_str);
			self.setupMainContainers();
			self.setupDescription();
			self.setupProgress();
			self.setupTimeD0();
			self.setupPlayPauseButton();
			self.setupDumy();
		};
		
		//#################################//
		/* set image */
		//#################################//
		this.setupMainContainers = function(){
			self.imageHolder_do = new FWDMSPDisplayObject("div");
			self.addChild(self.imageHolder_do);
		};
		
		//#################################//
		/* setup progress */
		//#################################//
		this.setupProgress = function(){
			self.progress_do = new FWDMSPDisplayObject("div");
			self.progress_do.setBkColor("#FFFFFF");
			self.progress_do.setAlpha(.7);
			self.addChild(self.progress_do);
		};
		
		this.updateProgress = function(percent){
			self.progressPercent = percent;
			FWDAnimation.to(self.progress_do, .6, {w:self.finalW * self.progressPercent});
		};
		
		//#################################//
		/* setup play/pause button */
		//#################################//
		this.setupPlayPauseButton = function(){
			FWDMSPPageComplexButton.setPrototype();
		
			if(reverse){
				self.pButton_do = new FWDMSPPageComplexButton(
					"graphics/playw-button.jpg",
					"graphics/playw-button-over.jpg",
					"graphics/pausew-button.jpg",
					"graphics/pausew-button-over.jpg",
					28,27, true
				);
			}else{
				self.pButton_do = new FWDMSPPageComplexButton(
					"graphics/play-button.jpg",
					"graphics/play-button-over.jpg",
					"graphics/pause-button.jpg",
					"graphics/pause-button-over.jpg",
					28,27, true
				);
			}
			
			self.pButton_do.addListener(FWDMSPPageComplexButton.MOUSE_UP, self.playPauseButtonStartHandler);
			self.addChild(self.pButton_do);
		};
		
		this.playPauseButtonStartHandler = function(){
			self.dispatchEvent(FWDMSPPageComplexButton.MOUSE_UP, {buttonState:self.pButton_do.currentState, thumbId:self.id});
		};
		
		this.setButtonState = function(state){
			self.pButton_do.setButtonState(state);
		};
		
		this.positionPlayPauseButton = function(){
			self.pButton_do.setY(parseInt(self.finalH + 14));
		};
		
		this.disablePlayPauseButton = function(){
			self.pButton_do.disable();
		};
		
		//################################################//
		/* Setup title bar */
		//###############################################//
		this.setupDescription = function(){
			self.simpleText_do = new FWDMSPDisplayObject("div");
			self.simpleText_do.hasTransform3d_bl = false;
			self.simpleText_do.hasTransform2d_bl = false;
			
			self.simpleText_do.setBackfaceVisibility();
			self.simpleText_do.getStyle().width = "100%";
			self.simpleText_do.getStyle().fontFamily = "Arial";
			self.simpleText_do.getStyle().fontSize= "12px";
			self.simpleText_do.getStyle().textAlign = "left";
			self.simpleText_do.getStyle().color = self.apiPlaylistTitleColor_str;
			self.simpleText_do.getStyle().fontSmoothing = "antialiased";
			self.simpleText_do.getStyle().webkitFontSmoothing = "antialiased";
			self.simpleText_do.getStyle().textRendering = "optimizeLegibility";		
			self.simpleText_do.setInnerHTML(self.htmlContent);
			//self.simpleText_do.screen.innerText = self.htmlContent;
			self.addChild(self.simpleText_do);
		};
		
		this.positionDescription = function(){
			self.simpleText_do.setX(35);
			self.simpleText_do.setY(parseInt(self.finalH + 15));
		};
		
		this.setupTimeD0 = function(){
			self.time_do = new FWDMSPDisplayObject("div");
			self.time_do.hasTransform3d_bl = false;
			self.time_do.hasTransform2d_bl = false;
			
			self.time_do.setBackfaceVisibility();
			//self.time_do.getStyle().width = "100%";
			self.time_do.getStyle().fontFamily = "Arial";
			self.time_do.getStyle().fontSize= "12px";
			self.time_do.getStyle().textAlign = "left";
			self.time_do.getStyle().color = "#555555";
			self.time_do.getStyle().padding = "2px";
			self.time_do.getStyle().paddingBottom = "1px";
			if(FWDMSPUtils.isIEAndLessThen9){
				self.time_do.getStyle().backgroundColor = "#FFFFFF";
			}else{
				self.time_do.getStyle().backgroundColor = "rgba(255,255,255,0.6)";
			}
			self.time_do.getStyle().fontSmoothing = "antialiased";
			self.time_do.getStyle().webkitFontSmoothing = "antialiased";
			self.time_do.getStyle().textRendering = "optimizeLegibility";		
			self.time_do.setInnerHTML("00:00/00:00");
			self.addChild(self.time_do);
		};
		
		this.updateTime = function(time){
			self.time_do.setInnerHTML(time);
		};
		
		this.positionTime = function(){
			self.time_do.setY(parseInt(self.finalH - 15));
		};
	
		//#################################//
		/* set image */
		//#################################//
		this.setImage = function(image){
			self.normalImage_do = new FWDMSPDisplayObject("img");
			self.normalImage_do.setScreen(image);
			
			self.imageOriginalW = self.normalImage_do.w;
			self.imageOriginalH = self.normalImage_do.h;
		
		
			self.resizeImage();
			
			self.imageHolder_do.setX(parseInt(self.finalW/2));
			self.imageHolder_do.setY(parseInt(self.finalH/2));
			self.imageHolder_do.setWidth(0);
			self.imageHolder_do.setHeight(0);
			
			self.normalImage_do.setX(- parseInt(self.normalImage_do.w/2));
			self.normalImage_do.setY(- parseInt(self.normalImage_do.h/2));
			self.normalImage_do.setAlpha(0);
			
			FWDAnimation.to(self.imageHolder_do, .8, {
				x:0, 
				y:0,
				w:self.finalW,
				h:self.finalH, 
				ease:Expo.easeInOut});
			
			FWDAnimation.to(self.normalImage_do, .8, {
				alpha:1,
				x:self.imageFinalX, 
				y:self.imageFinalY, 
				ease:Expo.easeInOut});
		
			this.imageHolder_do.addChild(self.normalImage_do);
			if(self.effectImage_do) self.imageHolder_do.addChild(self.effectImage_do);
			
			this.hasImage_bl = true;
			
			if(self.id == parent.id){
				self.disable();
			}
		};
		
		//############################################//
		/* Setup dumy */
		//############################################//
		this.setupDumy = function(){
			self.dumy_do = new FWDMSPDisplayObject("div");
			if(FWDMSPUtils.isIE){
				self.dumy_do.setBkColor("#00FF00");
				self.dumy_do.setAlpha(.0001);
			}
			
			if(self.dumy_do.screen.addEventListener){
				if(!self.isMobile_bl) self.dumy_do.screen.addEventListener("mousedown", self.scrubHandler);
			}else if(self.dumy_do.screen.attachEvent){
				self.dumy_do.screen.attachEvent("onmousedown", self.scrubHandler);
			}
			self.addChild(self.dumy_do);
		};
		
		this.scrubHandler = function(e){
			if(self.progressPercent == 0) return;
			var wc = FWDMSPUtils.getViewportMouseCoordinates(e);
			var localX = wc.screenX - self.getGlobalX();
			var percent = localX/self.finalW;
			self.dispatchEvent(FWDMSPPageGridThumb.SCRUB, {percent:percent});
		};
	
		//#################################//
		/* resize thumbnail*/
		//#################################//
		this.resizeAndPosition = function(){
			
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.imageHolder_do);
			
			self.setX(self.finalX);
			self.setY(self.finalY);
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			self.imageHolder_do.setX(0);
			self.imageHolder_do.setY(0);
			self.imageHolder_do.setWidth(self.finalW);
			self.imageHolder_do.setHeight(self.finalH);
			self.dumy_do.setWidth(self.finalW);
			self.dumy_do.setHeight(self.finalH);
			
			self.progress_do.setWidth(self.finalW * self.progressPercent);
			self.progress_do.setHeight(self.finalH);
			
			self.resizeImage();
		
			self.positionDescription();
			self.positionTime();
			self.positionPlayPauseButton();
		};
	
		//#################################//
		/* resize image*/
		//#################################//
		this.resizeImage = function(animate){
			
			if(!self.normalImage_do) return;
			FWDAnimation.killTweensOf(self.normalImage_do);
			var scX = self.finalW/self.imageOriginalW;
			var scY = self.finalH/self.imageOriginalH;
			var ttsc;
			
			if(scX >= scY){
				ttsc = scX;
			}else{
				ttsc = scY;
			}
			
			self.imageFinalW = Math.ceil(ttsc * self.imageOriginalW);
			self.imageFinalH = Math.ceil(ttsc * self.imageOriginalH);
			self.imageFinalX = Math.round((self.finalW - self.imageFinalW)/2);
			self.imageFinalY = Math.round((self.finalH - self.imageFinalH)/2);
			
		
			self.normalImage_do.setX(self.imageFinalX);
			self.normalImage_do.setY(self.imageFinalY);
			self.normalImage_do.setWidth(self.imageFinalW);
			self.normalImage_do.setHeight(self.imageFinalH);
			
			if(self.normalImage_do.alpha != 1) self.normalImage_do.setAlpha(1);
			
		};
	

		this.init();
	};
	
	/* set prototype */
	FWDMSPPageGridThumb.setPrototype = function(){
		FWDMSPPageGridThumb.prototype = new FWDMSPDisplayObject("div");
	};
	
	
	FWDMSPPageGridThumb.MOUSE_UP = "onMouseUp";
	FWDMSPPageGridThumb.SCRUB = "scrub";

	FWDMSPPageGridThumb.prototype = null;
	window.FWDMSPPageGridThumb = FWDMSPPageGridThumb;
}(window));/* FWDPageMenu */
(function (window){
var FWDPageMenu = function(props_obj){
		
		var self = this;
		var prototype = FWDPageMenu.prototype;
		
		this.parent = props_obj.parent;
		
		this.menuLabels_ar = props_obj.menuLabels;
		this.menuButtons_ar = [];
		this.spacers_ar = [];
		
		this.availableSkins_do = null;
		this.buttonsHolder_do = null;
		
		this.shadowPath_str = props_obj.shadowPath;
		
		this.buttonSeparatorPath_str = props_obj.buttonSeparatorPath;
		this.button1NormalColor_str = props_obj.button1NormalColor; 
		this.button1SelectedColor_str = props_obj.button1SelectedColor;
		this.button2NormalColor_str = props_obj.button2NormalColor;
		this.button2SelectedColor_str = props_obj.button2SelectedColor;
		this.backgroundColorOrPath = props_obj.backgroundColorOrPath;
		this.spacerColor_str = props_obj.spacerColor;
		
		this.stageWidth = 0;
		this.stageHeight = 0;
		this.buttonsHolderWidth = 200;
		this.buttonsBarOriginalHeight = 80;
		this.totalHeight = 0;
		this.buttonsBarTotalHeight = 100;
		this.totalButtons = self.menuLabels_ar.length;
		this.totalHeight = 200;
		this.hSpace = 65;
		this.minHSpace = 10;
		this.vSpace = 20;
		this.minMarginXSpace = 10;
		this.startY = 8;
		
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.parent.style.height = "0px";
			self.setupButtons();
			setTimeout(function(){
				self.setOverflow("visible");
				self.positonButtons();
				}
			, 251);
			self.parent.appendChild(self.screen);
		};
		
		//###########################################//
		/* resize and position */
		//##########################################//
		this.positionAndResize = function(w){
			self.stageWidth = w;
			self.positonButtons();
		};
		
		//##########################################//
		/* setup buttons */
		//##########################################//
		this.setupButtons = function(){
			
			var button;
			
			var disableButton_bl = false;
			
			self.buttonsHolder_do = new FWDMSPDisplayObject("div");
			if(self.backgroundColorOrPath.indexOf(".") != -1){
				self.buttonsHolder_do.getStyle().background = "url('" + self.backgroundColorOrPath + "')";
			}else{
				self.buttonsHolder_do.setBkColor(self.backgroundColorOrPath);
			}
			
			self.buttonsHolder_do.setWidth(self.stageWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarOriginalHeight);
			self.addChild(self.buttonsHolder_do);
			
			for(var i=0; i<self.totalButtons; i++){
				var labels_ar = self.menuLabels_ar[i].split(",");
				var label1 = labels_ar[0];
				var label2 = labels_ar[1];
				
				FWDPageMenuButton.setPrototype();
				button = new FWDPageMenuButton(
						label1, 
						label2, 
						self.buttonSeparatorPath_str,  
						self.button1NormalColor_str, 
						self.button1SelectedColor_str,
						self.button2NormalColor_str, 
						self.button2SelectedColor_str);
				button.id = i;
				button.addListener(FWDPageMenuButton.CLICK, self.buttonClickHandler);
				self.menuButtons_ar[i] = button;
				self.buttonsHolder_do.addChild(button);
			}
			
			self.availableSkins_do = new FWDMSPDisplayObject("div");
			self.availableSkins_do.setBackfaceVisibility();
			self.availableSkins_do.hasTransform2d_bl = false;
			self.availableSkins_do.hasTransform3d_bl = false;
			self.availableSkins_do.getStyle().zIndex = 20;
			self.availableSkins_do.getStyle().whiteSpace= "nowrap";
			self.availableSkins_do.getStyle().fontFamily = "myFont, Arial";
			self.availableSkins_do.getStyle().fontSize= "16px";
			self.availableSkins_do.getStyle().color = "#000000";
			self.availableSkins_do.getStyle().fontSmoothing = "antialiased";
			self.availableSkins_do.getStyle().webkitFontSmoothing = "antialiased";
			self.availableSkins_do.getStyle().textRendering = "optimizeLegibility";	
			self.availableSkins_do.setInnerHTML("Available skins");
			self.availableSkins_do.setY(-15);
			self.addChild(self.availableSkins_do);
		};
		
		this.buttonClickHandler = function(e){
			self.dispatchEvent(FWDPageMenuButton.CLICK, {mainButtonId:e.mainButtonId, buttonId:e.buttonId});
		};
		
		this.disableButton = function(id1, id2){
			var button;
			for(var i=0; i<self.totalButtons; i++){
				button = self.menuButtons_ar[i];
				if(i == id1){
					button.disable(id2);
				}else{
					button.enable();
				}
			}
		};
		
		//###################################################//
		/* position buttons */
		//###################################################//
		this.positonButtons = function(){
			var button;
			var prevButton;
			var rowsAr = [];
			var rowsWidthAr = [];
			var rowsThumbsWidthAr = [];
			var tempX;
			var tempY = self.startY;
			var maxY = 0;
			var totalRowWidth = 0;
			var rowsNr = 0;
			
			rowsAr[rowsNr] = [0];
			rowsWidthAr[rowsNr] = self.menuButtons_ar[0].totalWidth;
			rowsThumbsWidthAr[rowsNr] = self.menuButtons_ar[0].totalWidth;
			
			for (var i=1; i<self.totalButtons; i++){
				button = self.menuButtons_ar[i];
				
				if (rowsWidthAr[rowsNr] + button.totalWidth + self.minHSpace > self.stageWidth - self.minMarginXSpace){	
					rowsNr++;
					rowsAr[rowsNr] = [];
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] = button.totalWidth;
					rowsThumbsWidthAr[rowsNr] = button.totalWidth;
				}else{
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] += button.totalWidth + self.minHSpace;
					rowsThumbsWidthAr[rowsNr] += button.totalWidth;
				}
			}
			
			if(rowsNr == 1){
				rowsNr = 0;
				rowsAr[rowsNr] = [0];
				rowsWidthAr[rowsNr] = self.menuButtons_ar[0].totalWidth;
				rowsThumbsWidthAr[rowsNr] = self.menuButtons_ar[0].totalWidth;
				for (var i=1; i<self.totalButtons; i++){
					button = self.menuButtons_ar[i];
					rowsNr++;
					rowsAr[rowsNr] = [];
					rowsAr[rowsNr].push(i);
					rowsWidthAr[rowsNr] = button.totalWidth;
					rowsThumbsWidthAr[rowsNr] = button.totalWidth;
				}
			}
			
			
			for (var i=0; i<rowsNr + 1; i++){
				var rowMarginXSpace = 0;
				
				if (i > 0){
					tempY += button.totalHeight + self.vSpace;
				}
				
				var rowHSpace;
				
				if (rowsAr[i].length > 1){
					rowHSpace = Math.min((self.stageWidth - self.minMarginXSpace - rowsThumbsWidthAr[i]) / (rowsAr[i].length - 1), self.hSpace);
					
					var rowWidth = rowsThumbsWidthAr[i] + rowHSpace * (rowsAr[i].length - 1);
					
					rowMarginXSpace = parseInt((self.stageWidth - rowWidth)/2);
				}else{
					rowMarginXSpace = parseInt((self.stageWidth - rowsWidthAr[i])/2);
				}
					
				for (var j=0; j<rowsAr[i].length; j++){
					button = self.menuButtons_ar[rowsAr[i][j]];
				
					if (j == 0){
						tempX = rowMarginXSpace;
					}else{
						prevButton = self.menuButtons_ar[rowsAr[i][j] - 1];
						tempX = prevButton.finalX + prevButton.totalWidth + rowHSpace - 6;
					}
					
					
					button.finalX = tempX + 4;
					button.finalY = tempY - 1;
					if(j == 4){
						if(rowsNr == 0){
							button.finalY += 20;
						}
					}else{
						if (maxY < button.finalY) maxY = button.finalY;
					}
					
					var removeFromTotalHeight = 0;
					if(rowsNr == 4 || rowsNr == 2){
						if(i == 4){
							removeFromTotalHeight = 38;
						}
					}
					
					if(rowsNr == 2){
						if(i == 2){
							removeFromTotalHeight = 38;
						}
					}
						
					self.buttonsBarTotalHeight = maxY + self.menuButtons_ar[0].totalHeight + self.startY - 2 - removeFromTotalHeight;
					button.setX(button.finalX);
					button.setY(button.finalY);
				}
			}
			
			
			self.availableSkins_do.setX(parseInt(self.stageWidth - 100)/2);
		
			self.buttonsHolder_do.setWidth(self.stageWidth);
			self.buttonsHolder_do.setHeight(self.buttonsBarTotalHeight);
		
			self.parent.style.height = (self.buttonsBarTotalHeight) + "px";
		};
	
	
		//##############################//
		/* destroy */
		//##############################//
		self.destroy = function(){
			self.setInnerHTML("");
			prototype.destroy();
			self = null;
			prototype = null;
			FWDPageMenu.prototype = null;
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDPageMenu.setPrototype = function(){
		FWDPageMenu.prototype = new FWDMSPDisplayObject("div");
	};
	
	FWDPageMenu.CLICK = "onClick";

	FWDPageMenu.prototype = null;
	window.FWDPageMenu = FWDPageMenu;
}(window));/* FWDPageMenuButton */
(function (){
var FWDPageMenuButton = function(
			label1, 
			label2,
			separatorLinePath,
			button1NormalColor,
			button1SelectedColor,
			button2NormalColor,
			button2SelectedColor,
			disableButton_bl
		){
		
		var self = this;
		var prototype = FWDPageMenuButton.prototype;
		
		this.label1_str = label1;
		this.label2_str = label2;
		this.separatorLinePath_str = separatorLinePath;
		this.button1NormalColor_str = button1NormalColor;
		this.button1SelectedColor_str = button1SelectedColor;
		this.button2NormalColor_str = button2NormalColor;
		this.button2SelectedColor_str = button2SelectedColor;
	
		this.id;
		this.totalWidth = 400;
		this.totalHeight = 20;
		this.separatorW = 152;
		this.separatorH = 1;
		
		this.separator_do = null;
		this.text1_sdo = null;
		this.text2_sdo = null;
		this.dumy1_sdo = null;
		this.dumy2_sdo = null;
		
		this.finalX;
		this.finalY;
		this.separatorMarginTopAndBottom = 10;
		
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.disableButton_bl = disableButton_bl;
		this.currentState = 1;
		this.isFirstButtonDisabled_bl = false;
		this.isSecondButtonDisabled_bl = false;
	
		
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setBackfaceVisibility();
			self.setOverflow("visible");
			self.setupMainContainers();
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);
			if(self.disableButton_bl) self.disable();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			
			if(self.label2_str){
				self.separator_do = new FWDMSPDisplayObject("img");
				self.separator_do.screen.src = self.separatorLinePath_str;
				self.separator_do.setWidth(self.separatorW);
				self.separator_do.setHeight(self.separatorH);
			}
		
			self.text1_sdo = new FWDMSPDisplayObject("div");
			self.text1_sdo.setBackfaceVisibility();
			self.text1_sdo.hasTransform2d_bl = false;
			self.text1_sdo.hasTransform3d_bl = false;
			self.text1_sdo.getStyle().whiteSpace= "nowrap";
			self.text1_sdo.getStyle().fontFamily = "myFont, Arial";
			self.text1_sdo.getStyle().fontSize= "20px";
			self.text1_sdo.getStyle().color = self.button1NormalColor_str;
			self.text1_sdo.getStyle().fontSmoothing = "antialiased";
			self.text1_sdo.getStyle().webkitFontSmoothing = "antialiased";
			self.text1_sdo.getStyle().textRendering = "optimizeLegibility";	
			self.text1_sdo.setInnerHTML(self.label1_str);
			
			if(self.label2_str){
				self.text2_sdo = new FWDMSPDisplayObject("div");
				self.text2_sdo.setBackfaceVisibility();
				self.text2_sdo.hasTransform2d_bl = false;
				self.text2_sdo.hasTransform3d_bl = false;
				self.text2_sdo.getStyle().whiteSpace= "nowrap";
				self.text2_sdo.getStyle().fontFamily = "myFont, Arial";
				self.text2_sdo.getStyle().fontSize= "20px";
				self.text2_sdo.getStyle().color = self.button2NormalColor_str;
				self.text2_sdo.getStyle().fontSmoothing = "antialiased";
				self.text2_sdo.getStyle().webkitFontSmoothing = "antialiased";
				self.text2_sdo.getStyle().textRendering = "optimizeLegibility";	
				self.text2_sdo.setInnerHTML(self.label2_str);
			}
		
			self.dumy1_sdo = new FWDMSPDisplayObject("div");
			if(FWDMSPUtils.isIE){
				self.dumy1_sdo.setBkColor("#FF0000");
				self.dumy1_sdo.setAlpha(.01);
			};
				
			self.dumy2_sdo = new FWDMSPDisplayObject("div");
			if(FWDMSPUtils.isIE){
				self.dumy2_sdo.setBkColor("#FF0000");
				self.dumy2_sdo.setAlpha(.01);
			};
			self.dumy1_sdo.setButtonMode(true);
			self.dumy2_sdo.setButtonMode(true);
				
			self.addChild(self.text1_sdo);
			
			if(self.text2_sdo){
				self.addChild(self.text2_sdo);
				self.addChild(self.dumy2_sdo);
			}
			
			self.addChild(self.dumy1_sdo);
			if(self.separator_do) self.addChild(self.separator_do);
			
			
			setTimeout(function(){
				self.centerText();
			}, 300);
			
			if(self.isMobile_bl){
				self.dumy1_sdo.screen.addEventListener("click", self.firstButtonClick);
				self.dumy2_sdo.screen.addEventListener("click", self.secondButtonClick);
			}else if(self.screen.addEventListener){
				self.dumy1_sdo.screen.addEventListener("mouseover", self.firstButtonMouseOver);
				self.dumy1_sdo.screen.addEventListener("mouseout", self.firstButtonMouseOut);
				self.dumy1_sdo.screen.addEventListener("click", self.firstButtonClick);
				self.dumy2_sdo.screen.addEventListener("mouseover", self.secondButtonMouseOver);
				self.dumy2_sdo.screen.addEventListener("mouseout", self.secondButtonMouseOut);
				self.dumy2_sdo.screen.addEventListener("click", self.secondButtonClick);
			}else if(self.screen.attachEvent){
				self.dumy1_sdo.screen.attachEvent("onmouseover", self.firstButtonMouseOver);
				self.dumy1_sdo.screen.attachEvent("onmouseout", self.firstButtonMouseOut);
				self.dumy1_sdo.screen.attachEvent("onclick", self.firstButtonClick);
				self.dumy2_sdo.screen.attachEvent("onmouseover", self.secondButtonMouseOver);
				self.dumy2_sdo.screen.attachEvent("onmouseout", self.secondButtonMouseOut);
				self.dumy2_sdo.screen.attachEvent("onclick", self.secondButtonClick);
			}
		};
		
		self.firstButtonMouseOver = function(animate){
			if(self.isFirstButtonDisabled_bl) return;
			FWDAnimation.killTweensOf(self.text1_sdo);
			if(animate){
				FWDAnimation.to(self.text1_sdo.screen, .5, {css:{color:self.button1SelectedColor_str}, ease:Expo.easeOut});
			}else{
				self.text1_sdo.getStyle().color = self.button1SelectedColor_str;
			}
		};
			
		self.firstButtonMouseOut = function(e){	
			if(self.isFirstButtonDisabled_bl) return;
			FWDAnimation.to(self.text1_sdo.screen, .5, {css:{color:self.button1NormalColor_str}, ease:Expo.easeOut});
		};
		
		self.firstButtonClick = function(e){
			if(self.isFirstButtonDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDPageMenuButton.CLICK, {mainButtonId:self.id, buttonId:0});
		};
		
		self.secondButtonMouseOver = function(animate){
			if(self.isSecondButtonDisabled_bl || !self.text2_sdo) return;
			
			FWDAnimation.killTweensOf(self.text2_sdo);
			if(animate){
				FWDAnimation.to(self.text2_sdo.screen, .5, {css:{color:self.button2SelectedColor_str}, ease:Expo.easeOut});
			}else{
				self.text2_sdo.getStyle().color = self.button2SelectedColor_str;
			}
		};
			
		self.secondButtonMouseOut = function(e){
			if(self.isSecondButtonDisabled_bl || !self.text2_sdo) return;
			FWDAnimation.to(self.text2_sdo.screen, .5, {css:{color:self.button2NormalColor_str}, ease:Expo.easeOut});
		};
		
		self.secondButtonClick = function(e){		
			if(self.isSecondButtonDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDPageMenuButton.CLICK, {mainButtonId:self.id, buttonId:1});
		};
		
		//##############################//
		/* set selected state */
		//##############################//
		self.disable = function(id){
			if(id == 0){
				self.isFirstButtonDisabled_bl = true;
				self.isSecondButtonDisabled_bl = false;
				self.dumy1_sdo.setButtonMode(false);
				self.dumy2_sdo.setButtonMode(true);
				self.text1_sdo.getStyle().color = self.button1SelectedColor_str;
				if(self.text2_sdo) self.text2_sdo.getStyle().color = self.button2NormalColor_str;
			}else{
				self.isSecondButtonDisabled_bl = true;
				self.isFirstButtonDisabled_bl = false;
				self.dumy1_sdo.setButtonMode(true);
				self.dumy2_sdo.setButtonMode(false);
				self.text1_sdo.getStyle().color = self.button1NormalColor_str;
				if(self.text2_sdo) self.text2_sdo.getStyle().color = self.button2SelectedColor_str;
			}
			
		};		
		
		self.enable = function(id){
			self.isFirstButtonDisabled_bl = false;
			self.isSecondButtonDisabled_bl = false;
			self.dumy1_sdo.setButtonMode(true);
			self.dumy2_sdo.setButtonMode(true);
			self.text1_sdo.getStyle().color = self.button1NormalColor_str;
			if(self.text2_sdo) self.text2_sdo.getStyle().color = self.button2NormalColor_str;
		};		

		//##########################################//
		/* center text */
		//##########################################//
		self.centerText = function(){
			var maxWidth = 0;
			var textHeight = self.text1_sdo.getHeight();
			var text1Width = self.text1_sdo.getWidth();
			var text2Width = 0;
			if(self.text2_sdo) text2Width = self.text2_sdo.getWidth();
			
			
			if(maxWidth < text1Width){
				maxWidth = text1Width;
			}
			
			if(maxWidth < text2Width){
				maxWidth = text2Width;
			}
			
			self.totalWidth = maxWidth;
			
			if(self.separator_do){
				self.totalHeight = textHeight * 2 + self.separator_do.h + self.separatorMarginTopAndBottom * 2;
			}else{
				self.totalHeight = textHeight;
			}
			
		
			self.text1_sdo.setX(parseInt(self.totalWidth - text1Width)/2);
			self.dumy1_sdo.setX(self.text1_sdo.x);
			self.dumy1_sdo.setWidth(text1Width);
			self.dumy1_sdo.setHeight(textHeight);
			
			if(self.separator_do){
				self.separator_do.setX(parseInt(self.totalWidth - self.separator_do.w)/2);
				self.separator_do.setY(textHeight + self.separatorMarginTopAndBottom);
			}
			
			if(self.text2_sdo){
				self.text2_sdo.setX(parseInt(self.totalWidth - text2Width)/2);
				if(self.separator_do){
					self.text2_sdo.setY(self.separator_do.y + self.separatorMarginTopAndBottom);
				}else{
					self.text2_sdo.setY(self.separatorMarginTopAndBottom);
				}
				self.dumy2_sdo.setY(self.text2_sdo.y);
				self.dumy2_sdo.setWidth(text2Width);
				self.dumy2_sdo.setHeight(textHeight);
			}
			
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDPageMenuButton.setPrototype = function(){
		FWDPageMenuButton.prototype = new FWDMSPDisplayObject("div");
	};
	
	FWDPageMenuButton.CLICK = "firstButtonClick";
	
	FWDPageMenuButton.prototype = null;
	window.FWDPageMenuButton = FWDPageMenuButton;
}(window));/* FWDMSPPageSimpleButton */
(function (window){
var FWDMSPPageSimpleButton = function(
		nImgPath, 
		sImgPath,
		buttonWidth,
		buttonHeight){
		
		var self = this;
		var prototype = FWDMSPPageSimpleButton.prototype;
		
		this.nImg_img = null;
		this.sImg_img = null;
	
		this.n_do;
		this.s_do;
		
		this.nImgPath_str = nImgPath;
		this.sImgPath_str = sImgPath;
		
		this.buttonWidth = buttonWidth;
		this.buttonHeight = buttonHeight;
		
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.hasPointerEvent_bl = FWDMSPUtils.hasPointerEvent;
		this.isDisabled_bl = false;
		
		
		//##########################################//
		/* initialize this */
		//##########################################//
		this.init = function(){
			self.setupMainContainers();
			self.setWidth(self.buttonWidth);
			self.setHeight(self.buttonHeight);
			self.setButtonMode(true);
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		this.setupMainContainers = function(){
			
			self.n_do = new FWDMSPDisplayObject("img");	
			self.nImg_img = new Image();
			self.nImg_img.src = self.nImgPath_str;
			self.nImg_img.width = self.buttonWidth;
			self.nImg_img.height = self.buttonHeight;
			self.n_do.setScreen(self.nImg_img);
			
			self.s_do = new FWDMSPDisplayObject("img");	
			self.sImg_img = new Image();
			self.sImg_img.src = self.sImgPath_str;
			self.sImg_img.width = self.buttonWidth;
			self.sImg_img.height = self.buttonHeight;
			self.s_do.setScreen(self.sImg_img);
			
			self.addChild(self.s_do);
			self.addChild(self.n_do);
			
			self.screen.onmouseover = self.onMouseOver;
			self.screen.onmouseout = self.onMouseOut;
			self.screen.onclick = self.onClick;
			
		};
		
		this.onMouseOver = function(e){
			FWDAnimation.to(self.n_do, .9, {alpha:0, ease:Expo.easeOut});
		};
			
		this.onMouseOut = function(e){
			FWDAnimation.to(self.n_do, .9, {alpha:1, ease:Expo.easeOut});	
		};
			
		this.onClick = function(e){
			self.dispatchEvent(FWDMSPPageSimpleButton.CLICK);
		};
		
	
		self.init();
	};
	
	/* set prototype */
	FWDMSPPageSimpleButton.setPrototype = function(){
		FWDMSPPageSimpleButton.prototype = null;
		FWDMSPPageSimpleButton.prototype = new FWDMSPDisplayObject("div", "relative");
	};
	
	FWDMSPPageSimpleButton.CLICK = "onClick";
	
	FWDMSPPageSimpleButton.prototype = null;
	window.FWDMSPPageSimpleButton = FWDMSPPageSimpleButton;
}(window));/* FWDMSPPageThumb */
(function (window){
	
	var FWDMSPPageThumb = function(
			pId, 
			shadowPath,
			imageOverPath,
			textToShow,
			iconText,
			offsetHeight,
			borderSize, 
			borderColor,
			textNormalColor,
			textSelectedColor,
			wiewSampleTextColor,
			shadowOffsetX,
			shadowOffsetY,
			shadowOffsetW,
			shadowOffsetH){
		
		var self = this;
		var prototype = FWDMSPPageThumb.prototype;

		this.main_do = null;
		this.shadow_sdo = null;
		this.border_do = null;
		this.imageHolder_do = null;
		this.image_do = null;
		this.text_sdo = null;
		this.icon_sdo = null;
		this.overlay_sdo = null;
		this.over_sdo = null;
		
		this.shadowPath_str = shadowPath;
		this.imageOverPath_str = imageOverPath;
		this.textToShow_str = textToShow;
		this.iconText_str = iconText;
		this.borderColor_str = borderColor;
		this.textNormalColor_str = textNormalColor;
		this.textSelectedColor_str = textSelectedColor;
		this.wiewSampleTextColor_str = wiewSampleTextColor;

		this.borderSize = borderSize;
		this.id = pId;
		this.imageOriginalW;
		this.imageOriginalH;
		this.borderSize;
		this.finalX;
		this.finalY;
		this.finalW;
		this.finalH;
		this.imageFinalX;
		this.imageFinalY;
		this.imageFinalW;
		this.imageFinalH;
		this.offsetHeight = offsetHeight;
		this.shadowOffsetX = shadowOffsetX;
		this.shadowOffsetY = shadowOffsetY;
		this.shadowOffsetW = shadowOffsetW;
		this.shadowOffsetH = shadowOffsetH;
	
		this.isShowed_bl = false;
		this.hasImage_bl = false;
		this.isMobile_bl = FWDMSPUtils.isMobile;
		this.tweenOnShow_bl = true;
		this.isDisabled_bl = false;

		this.init = function(){
			self.setOverflow("visible");
			self.setupMainContainers();
		};
		
		//#################################//
		/* setup main containers */
		//#################################//
		this.setupMainContainers = function(){
			var image_img;
			
			self.shadow_sdo = new FWDMSPDisplayObject("img");
			image_img = new Image();
			image_img.src = self.shadowPath_str;
			self.shadow_sdo.setScreen(image_img);
			self.shadow_sdo.setX(-7 + self.shadowOffsetX);
			self.shadow_sdo.setY(-11 + self.shadowOffsetY);
			self.addChild(self.shadow_sdo);
			
			self.main_do = new FWDMSPDisplayObject("div");
			self.main_do.setResizableSizeAfterParent();
			self.border_do = new FWDMSPDisplayObject("div");
			self.border_do.setResizableSizeAfterParent();
			self.border_do.setBkColor(self.borderColor_str);
			self.imageHolder_do = new FWDMSPDisplayObject("div");
			
			self.text_sdo = new FWDMSPDisplayObject("div");
			self.text_sdo.setOverflow("visible");
			self.text_sdo.getStyle().width = "100%";
			self.text_sdo.getStyle().textAlign = "center";
			self.text_sdo.getStyle().fontFamily = "Arial";
			self.text_sdo.getStyle().fontSize= "13px";
			self.text_sdo.getStyle().color = self.textNormalColor_str;
			self.text_sdo.getStyle().fontSmoothing = "antialiased";
			self.text_sdo.getStyle().webkitFontSmoothing = "antialiased";
			self.text_sdo.getStyle().textRendering = "optimizeLegibility";	
			self.text_sdo.setX(self.borderSize);
			self.text_sdo.setInnerHTML(self.textToShow_str);
			
			self.icon_sdo = new FWDMSPDisplayObject("div");
			self.icon_sdo.getStyle().width = "100%";
			self.icon_sdo.getStyle().textAlign = "center";
			self.icon_sdo.getStyle().fontFamily = "Arial";
			self.icon_sdo.getStyle().fontSize= "13px";
			self.icon_sdo.getStyle().letterSpacing = "2px";
			self.icon_sdo.getStyle().color = self.wiewSampleTextColor_str;
			self.icon_sdo.getStyle().fontSmoothing = "antialiased";
			self.icon_sdo.getStyle().webkitFontSmoothing = "antialiased";
			self.icon_sdo.getStyle().textRendering = "optimizeLegibility";	
			self.icon_sdo.setInnerHTML(self.iconText_str);
			
			if(!FWDMSPUtils.hasTransform2d) self.icon_sdo.setAlpha(0);
			
			self.overlay_sdo = new FWDMSPDisplayObject("div");
			self.overlay_sdo.setBkColor("#000000");
			self.overlay_sdo.setAlpha(0);
			
			self.over_sdo = new FWDMSPDisplayObject("div");
			if(FWDMSPUtils.isIE) self.over_sdo.getStyle().background = "url('dumy')";
			
			self.main_do.addChild(self.border_do);
			self.main_do.addChild(self.imageHolder_do);
			self.main_do.addChild(self.text_sdo);
			self.addChild(self.main_do);
			self.main_do.addChild(self.icon_sdo);
			self.addChild(self.over_sdo);
		};
		
		//#################################//
		/* set image */
		//#################################//
		this.setImage = function(image){
			self.image_do = new FWDMSPDisplayObject("img");
			self.image_do.setScreen(image);
			self.setButtonMode(true);
			
			self.imageOriginalW = self.image_do.w;
			self.imageOriginalH = self.image_do.h;
			
			self.imageHolder_do.addChild(self.image_do);	
			self.imageHolder_do.addChild(self.overlay_sdo);
			self.hasImage_bl = false;
			
			self.resizeImage();
			
			if(self.tweenOnShow_bl){
				
				self.imageHolder_do.setX(parseInt(self.finalW/2));
				self.imageHolder_do.setY(parseInt((self.finalH - self.offsetHeight)/2));
				self.imageHolder_do.setWidth(0);
				self.imageHolder_do.setHeight(0);
				self.image_do.setX(- parseInt(self.image_do.w/2));
				self.image_do.setY(- parseInt(self.image_do.h/2));
				self.image_do.setAlpha(0);
				
				FWDAnimation.to(self.imageHolder_do, .8, {
					x:self.borderSize, 
					y:self.borderSize,
					w:self.finalW - (self.borderSize * 2),
					h:self.finalH - (self.borderSize * 2), ease:Expo.easeInOut});
				
				FWDAnimation.to(self.image_do, .8, {
					alpha:1,
					x:0, 
					y:0, ease:Expo.easeInOut});
			}
			
			if(self.screen.addEventListener){
				if(!self.isMobile_bl){
					self.over_sdo.screen.addEventListener("mouseover", self.onMouseOverHandler);
					self.over_sdo.screen.addEventListener("mouseout", self.onMouseOutHandler);
				}
				self.over_sdo.screen.addEventListener("click", self.onMouseClickHandler);
			}else{
				if(!self.isMobile_bl){
					self.over_sdo.screen.attachEvent("onmouseover", self.onMouseOverHandler);
					self.over_sdo.screen.attachEvent("onmouseout", self.onMouseOutHandler);
				}
				self.over_sdo.screen.attachEvent("onclick", self.onMouseClickHandler);
			}
			self.hasImage_bl = true;
		};
		
		this.onMouseOverHandler = function(animate){
			if(self.isDisabled_bl) return;
			FWDAnimation.to(self.text_sdo.screen, .5, {css:{color:self.textSelectedColor_str}, ease:Expo.easeOut});
			FWDAnimation.to(self.overlay_sdo, .5, {alpha:.7, ease:Expo.easeOut});
			if(FWDMSPUtils.hasTransform2d){
				self.icon_sdo.getStyle().left = self.borderSize + "px";
				FWDAnimation.to(self.icon_sdo.screen, .5, {css:{scale:1}, ease:Expo.easeOut});
			}else{
				self.icon_sdo.getStyle().left = self.borderSize + "px";
				FWDAnimation.to(self.icon_sdo, .5, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.onMouseOutHandler = function(e){
			if(self.isDisabled_bl) return;
			FWDAnimation.to(self.text_sdo.screen, .5, {css:{color:self.textNormalColor_str}, ease:Expo.easeOut});
			FWDAnimation.to(self.overlay_sdo, .5, {alpha:0, ease:Expo.easeOut});
			if(FWDMSPUtils.hasTransform2d){
				FWDAnimation.to(self.icon_sdo.screen, .5, {css:{scale:0}, ease:Expo.easeOut});
			}else{
				FWDAnimation.to(self.icon_sdo, .5, {alpha:0, ease:Expo.easeOut});
			}
		};
		
		this.onMouseClickHandler = function(e){
			if(self.isDisabled_bl) return;
			self.dispatchEvent(FWDMSPPageThumb.CLICK);
		};
		
		//#################################//
		/* resize thumbnail*/
		//#################################//
		this.resizeThumb = function(animate){
			
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.imageHolder_do);
			
			if(animate){
				FWDAnimation.to(self, .8, {
					x:self.finalX, 
					y:self.finalY,
					w:self.finalW,
					h:self.finalH,
					ease:Expo.easeInOut});
			}else{
				self.setX(self.finalX);
				self.setY(self.finalY);
			}
			
			self.setWidth(self.finalW);
			self.setHeight(self.finalH);
			self.imageHolder_do.setX(self.borderSize);
			self.imageHolder_do.setY(self.borderSize);
			self.imageHolder_do.setWidth(self.finalW - (self.borderSize * 2));
			self.imageHolder_do.setHeight(self.finalH - (self.borderSize * 2));
			
			self.text_sdo.setWidth(self.finalW - (self.borderSize * 2));
			self.text_sdo.setY((self.finalH - self.offsetHeight) + parseInt((self.offsetHeight - self.text_sdo.getHeight())/2) - parseInt(self.borderSize/2));
		
			self.shadow_sdo.setWidth(self.finalW + 16 + self.shadowOffsetW);
			self.shadow_sdo.setHeight(self.finalH + 20 + + self.shadowOffsetH);
			
			self.icon_sdo.setWidth(self.finalW - (self.borderSize * 2));
			self.icon_sdo.setY(self.borderSize + parseInt((self.finalH - self.offsetHeight - self.borderSize - 13)/2));
			
			if(FWDMSPUtils.hasTransform2d){
				self.icon_sdo.getStyle().left =  "-500px";
				FWDAnimation.to(self.icon_sdo.screen, 0, {css:{scale:0}});
			}else{
				self.icon_sdo.getStyle().left =  "-500px";
			}
			
			self.over_sdo.setWidth(self.finalW);
			self.over_sdo.setHeight(self.finalH);
			
			self.resizeImage();
		};
	
		
		//#################################//
		/* resize image*/
		//#################################//
		this.resizeImage = function(animate){
			
			if(!self.image_do) return;
			
			FWDAnimation.killTweensOf(self.image_do);
			var scX = (self.finalW -  (self.borderSize * 2))/self.imageOriginalW;
			var scY = (self.finalH - (self.borderSize * 2))/self.imageOriginalH;
			var ttsc;
			
			if(scX <= scY){
				ttsc = scX;
			}else{
				ttsc = scY;
			}
		
			self.imageFinalW = Math.ceil(ttsc * self.imageOriginalW);
			self.imageFinalH = Math.ceil(ttsc * self.imageOriginalH);
			
			self.image_do.setX(0);
			self.image_do.setY(0);
			self.image_do.setWidth(self.imageFinalW);
			self.image_do.setHeight(self.imageFinalH);
			self.image_do.setAlpha(1);
			self.overlay_sdo.setWidth(self.imageFinalW);
			self.overlay_sdo.setHeight(self.imageFinalH);
		};
		
		//################################//
		/* enable /disable */
		//################################//
		this.disable = function(){
			self.isDisabled_bl = true;
			FWDAnimation.to(self.overlay_sdo, .5, {alpha:.7, ease:Expo.easeOut});
			if(FWDMSPUtils.hasTransform2d){
				FWDAnimation.to(self.icon_sdo.screen, .5, {css:{scale:0}, ease:Expo.easeOut});
			}else{
				FWDAnimation.to(self.icon_sdo, .5, {alpha:0, ease:Expo.easeOut});
			}
			
			self.over_sdo.setButtonMode(false);
			self.text_sdo.getStyle().color = self.textSelectedColor_str;
		};		
		
		this.enable = function(){
			self.isDisabled_bl = false;
			FWDAnimation.to(self.overlay_sdo, .5, {alpha:0, ease:Expo.easeOut});
			self.over_sdo.setButtonMode(true);
			self.text_sdo.getStyle().color = self.textNormalColor_str;
		};		
		
		self.init();
	};
	
	/* set prototype */
	FWDMSPPageThumb.setPrototype = function(){
		FWDMSPPageThumb.prototype = new FWDMSPDisplayObject("div");
	};
	
	
	FWDMSPPageThumb.CLICK = "onClick";
	FWDMSPPageThumb.HIDE_OVERLAY = "onShowOverlay";
	FWDMSPPageThumb.SHOW_OVERLAY = "onHideOverlay";
	
	FWDMSPPageThumb.prototype = null;
	window.FWDMSPPageThumb = FWDMSPPageThumb;
}(window));/* FWDMSPSimpleButton */
(function (window){
var FWDMSPSimpleButton = function(nImg, sImg, dImg){
		
		var self = this;
		var prototype = FWDMSPSimpleButton.prototype;
		
		this.nImg = nImg;
		this.sImg = sImg;
		this.dImg = dImg;
		
		this.n_sdo;
		this.s_sdo;
		this.d_sdo;
		
		this.toolTipLabel_str;
		
		this.totalWidth = this.nImg.width;
		this.totalHeight = this.nImg.height;
		
		this.isSetToDisabledState_bl = false;
		this.isDisabled_bl = false;
		this.isDisabledForGood_bl = false;
		this.isSelectedFinal_bl = false;
		this.isActive_bl = false;
		this.isMobile_bl = FWDUtils.isMobile;
		this.hasPointerEvent_bl = FWDUtils.hasPointerEvent;
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setupMainContainers();
		};
		
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			self.n_sdo = new FWDDisplayObject("img");	
			self.n_sdo.setScreen(self.nImg);
			self.s_sdo = new FWDDisplayObject("img");
			self.s_sdo.setScreen(self.sImg);
			
			self.s_sdo.setAlpha(0);
			self.addChild(self.n_sdo);
			self.addChild(self.s_sdo);
			//self.setBkColor("#FF0000")
			
			if(self.dImg){
				self.d_sdo = new FWDDisplayObject("img");	
				self.d_sdo.setScreen(self.dImg);
				if(self.isMobile_bl){
					self.d_sdo.setX(-100);
				}else{
					self.d_sdo.setAlpha(0);
				}
				self.addChild(self.d_sdo);
			};
			
			
			self.setWidth(self.nImg.width);
			self.setHeight(self.nImg.height);
			self.setButtonMode(true);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.onMouseUp);
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
				}else{
					self.screen.addEventListener("touchend", self.onMouseUp);
				}
			}else if(self.screen.addEventListener){	
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mousedown", self.onMouseUp);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseUp);
			}
		};
		
		self.onMouseOver = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDMSPSimpleButton.MOUSE_OVER, {e:e});
				self.setSelectedState();
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabledForGood_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				if(self.isDisabled_bl || self.isSelectedFinal_bl) return;
				self.dispatchEvent(FWDMSPSimpleButton.MOUSE_OUT, {e:e});
				self.setNormalState();
			}
		};
		
		self.onMouseUp = function(e){
			if(self.isDisabledForGood_bl) return;
			if(e.preventDefault) e.preventDefault();
			if(self.isDisabled_bl || e.button == 2) return;
			self.dispatchEvent(FWDMSPSimpleButton.MOUSE_UP, {e:e});
		};
		
		//##############################//
		// set select / deselect final.
		//##############################//
		self.setSelected = function(){
			self.isSelectedFinal_bl = true;
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .8, {alpha:1, ease:Expo.easeOut});
		};
		
		self.setUnselected = function(){
			self.isSelectedFinal_bl = false;
			TweenMax.to(self.s_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Set normal / selected state */
		//####################################//
		this.setNormalState = function(){
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .5, {alpha:0, ease:Expo.easeOut});	
		};
		
		this.setSelectedState = function(){
			TweenMax.killTweensOf(self.s_sdo);
			TweenMax.to(self.s_sdo, .5, {alpha:1, delay:.1, ease:Expo.easeOut});
		};
		
		//####################################//
		/* Disable / enable */
		//####################################//
		this.setDisabledState = function(){
			if(self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = true;
			if(self.isMobile_bl){
				self.d_sdo.setX(0);
			}else{
				TweenMax.killTweensOf(self.d_sdo);
				TweenMax.to(self.d_sdo, .8, {alpha:1, ease:Expo.easeOut});
			}
		};
		
		this.setEnabledState = function(){
			if(!self.isSetToDisabledState_bl) return;
			self.isSetToDisabledState_bl = false;
			if(self.isMobile_bl){
				self.d_sdo.setX(-100);
			}else{
				TweenMax.killTweensOf(self.d_sdo);
				TweenMax.to(self.d_sdo, .8, {alpha:0, delay:.1, ease:Expo.easeOut});
			}
		};
		
		this.disable = function(){
			if(self.isDisabledForGood_bl) return;
			self.isDisabled_bl = true;
			self.setButtonMode(false);
		};
		
		this.enable = function(){
			if(self.isDisabledForGood_bl) return;
			self.isDisabled_bl = false;
			self.setButtonMode(true);
		};
		
		this.disableForGood = function(){
			self.isDisabledForGood_bl = true;
			self.setButtonMode(false);
		};
		
		self.init();
	};
	
	/* set prototype */
	FWDMSPSimpleButton.setPrototype = function(){
		FWDMSPSimpleButton.prototype = null;
		FWDMSPSimpleButton.prototype = new FWDDisplayObject("div");
	};
	
	FWDMSPSimpleButton.CLICK = "onClick";
	FWDMSPSimpleButton.MOUSE_OVER = "onMouseOver";
	FWDMSPSimpleButton.MOUSE_OUT = "onMouseOut";
	FWDMSPSimpleButton.MOUSE_UP = "onMouseDown";
	
	FWDMSPSimpleButton.prototype = null;
	window.FWDMSPSimpleButton = FWDMSPSimpleButton;
}(window));