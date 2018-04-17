		FWDMSPUtils.onReady(function(){
			setupMSP();
		});
		
		function setupMSP(){
			new FWDMSP({
				//main settings
				instanceName:"minimaldrk1",
				playlistsId:"playlists",
				mainFolderPath:"http://codes.flutenotes.ph/files/start/content/",
				skinPath:"minimal_skin_dark",
				showSoundCloudUserNameInTitle:"yes",
				privatePassword:"428c841430ea18a70f7b06525d4b748a",
				showMainBackground:"yes",
				verticalPosition:"bottom",
				useDeepLinking:"yes",
				useYoutube:"yes",
				useVideo:"yes",
				rightClickContextMenu:"default",
				showButtonsToolTips:"yes",
				animate:"yes",
				autoPlay:"no",
				loop:"no",
				shuffle:"no",
				maxWidth:850,
				volume:.8,
				toolTipsButtonsHideDelay:1.5,
				toolTipsButtonFontColor:"#888888",
				//controller settings
				showControllerByDefault:"yes",
				showThumbnail:"yes",
				showFullScreenButton:"yes",
				showNextAndPrevButtons:"no",
				showSoundAnimation:"yes",
				showLoopButton:"yes",
				showShuffleButton:"no",
				showDownloadMp3Button:"no",
				showBuyButton:"no",
				showShareButton:"no",
				expandBackground:"no",
				titleColor:"#FFFFFF",
				timeColor:"#888888",
				//controller align and size settings (described in detail in the documentation!)
				controllerHeight:76,
				startSpaceBetweenButtons:9,
				spaceBetweenButtons:8,
				separatorOffsetOutSpace:5,
				separatorOffsetInSpace:9,
				lastButtonsOffsetTop:14,
				allButtonsOffsetTopAndBottom:14,
				titleBarOffsetTop:13,
				mainScrubberOffsetTop:47,
				spaceBetweenMainScrubberAndTime:10,
				startTimeSpace:10,
				scrubbersOffsetWidth:2,
				scrubbersOffestTotalWidth:0,
				volumeButtonAndScrubberOffsetTop:47,
				spaceBetweenVolumeButtonAndScrubber:6,
				volumeScrubberOffestWidth:4,
				scrubberOffsetBottom:10,
				equlizerOffsetLeft:1,
				//playlists window settings
				usePlaylistsSelectBox:"no",
				showPlaylistsSelectBoxNumbers:"no",
				showPlaylistsButtonAndPlaylists:"no",
				showPlaylistsByDefault:"no",
				thumbnailSelectedType:"opacity",
				startAtPlaylist:0,
				startAtTrack:0,
				startAtRandomTrack:"no",
				buttonsMargins:0,
				thumbnailMaxWidth:330, 
				thumbnailMaxHeight:330,
				horizontalSpaceBetweenThumbnails:40,
				verticalSpaceBetweenThumbnails:40,
				mainSelectorBackgroundSelectedColor:"#FFFFFF",
				mainSelectorTextNormalColor:"#FFFFFF",
				mainSelectorTextSelectedColor:"#000000",
				mainButtonTextNormalColor:"#888888",
				mainButtonTextSelectedColor:"#FFFFFF",
				//playlist settings
				playTrackAfterPlaylistLoad:"no",
				showPlayListButtonAndPlaylist:"yes",
				showPlayListOnAndroid:"yes",
				showPlayListByDefault:"yes",
				showPlaylistItemPlayButton:"yes",
				showPlaylistItemDownloadButton:"no",
				showPlaylistItemBuyButton:"no",
				forceDisableDownloadButtonForPodcast:"yes",
				forceDisableDownloadButtonForOfficialFM:"yes",
				forceDisableDownloadButtonForFolder:"yes",
				addScrollBarMouseWheelSupport:"yes",
				showTracksNumbers:"no",
				playlistBackgroundColor:"#000000",
				trackTitleNormalColor:"#888888",
				trackTitleSelectedColor:"#FFFFFF",
				trackDurationColor:"#888888",
				maxPlaylistItems:30,
				nrOfVisiblePlaylistItems:12,
				trackTitleOffsetLeft:0,
				playPauseButtonOffsetLeftAndRight:11,
				durationOffsetRight:9,
				downloadButtonOffsetRight:11,
				scrollbarOffestWidth:7,
				//playback rate / speed
				showPlaybackRateButton:"yes",
				defaultPlaybackRate:1, //min - 0.5 / max - 3
				playbackRateWindowTextColor:"#FFFFFF",
				//search bar settings
				showSearchBar:"no",
				showSortButtons:"no",
				searchInputColor:"#999999",
				searchBarHeight:38,
				inputSearchTextOffsetTop:1,
				inputSearchOffsetLeft:0,
				//password window
				borderColor:"#333333",
				mainLabelsColor:"#FFFFFF",
				secondaryLabelsColor:"#a1a1a1",
				textColor:"#5a5a5a",
				inputBackgroundColor:"#000000",
				inputColor:"#FFFFFF",
				//opener settings
				openerAlignment:"right",
				showOpener:"yes",
				showOpenerPlayPauseButton:"yes",
				openerEqulizerOffsetLeft:3,
				openerEqulizerOffsetTop:-1,
				//popup settings
				showPopupButton:"yes",
				popupWindowBackgroundColor:"#878787",
				popupWindowWidth:850,
				popupWindowHeight:423
			});
		}
