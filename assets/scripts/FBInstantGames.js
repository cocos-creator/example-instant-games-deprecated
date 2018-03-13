// Facebook 官方 API 传送门：https://developers.facebook.com/docs/games/instant-games/sdk
// 使用 Instant Games API 自定义组件（通常用户会自己自身需求去使用 API）
// 目前这里只是用了以下基础 API
// 玩家信息
// 1. FBInstant.player.getName
// 2. FBInstant.player.getID
// 3. FBInstant.player.getPhoto
// 其他信息
// 1. FBInstant.context.getID
// 2. FBInstant.context.getType
// 3. FBInstant.getLocale
// 4. FBInstant.getPlatform
// 4. FBInstant.getSDKVersion
// 退出，分享功能
// 1. FBInstant.quit
// 2. FBInstant.shareAsync
cc.Class({
    extends: cc.Component,
    properties: {
        avatar: cc.Sprite,      // 头像
        nick_name: cc.Label,    // 昵称
        id: cc.Label,           // ID
        info: cc.Label          // 其他信息
    },

    start () {
        if (typeof FBInstant === 'undefined') return;
        
        // 显示玩家信息
        // 设置昵称
        this.nick_name.string = 'Name:' + FBInstant.player.getName();
        // 设置 ID
        this.id.string = 'ID:' + FBInstant.player.getID();
        // 设置头像
        var photoUrl = FBInstant.player.getPhoto();
        cc.loader.load(photoUrl, (err, texture) => {
            this.avatar.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 设置其他信息
        var info = {
            contextID: FBInstant.context.getID(), // 游戏 ID
            contextType: FBInstant.context.getType(), // 游戏类型
            locale: FBInstant.getLocale(),  // 地区
            platform: FBInstant.getPlatform(),// 平台
            sdkVersion: FBInstant.getSDKVersion(),// SDK 版本号
        }
        this.info.string = 'Context ID: ' + info.contextID + '\n' +
                           'Context Type: ' + info.contextType + '\n' +
                           'Locale: ' + info.locale + '\n' +
                           'Platform: ' + info.platform + '\n' +
                           'SDKVersion: ' + info.sdkVersion;
    },

    // 退出游戏
    onQuitGame () {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.quit();
    },

    // 分享功能
    onShareGame () {
        if (typeof FBInstant === 'undefined') return;
        FBInstant.shareAsync({
            intent: 'SHARE',
            image: this.getImgBase64(),
            text: 'X is asking for your help!',
            data: {myReplayData: '...'},
        }).then(() => {
            // continue with the game.
        });
    },

    // 截屏返回 iamge base6，用于 Share
    getImgBase64 () {
        let sp = cc.find('Canvas/New Sprite(Splash)').getComponent(cc.Sprite);

        let target = cc.find('Canvas');
        let width = 960, height = 640;
        let renderTexture = new cc.RenderTexture(width, height);
        renderTexture.begin();
        target._sgNode.visit();
        renderTexture.end();
        //
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            let texture = renderTexture.getSprite().getTexture();
            let image = texture.getHtmlElementObj();
            ctx.drawImage(image, 0, 0);
        }
        else if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            let buffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
            let texture = renderTexture.getSprite().getTexture()._glID;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            let data = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
                let imageData = new ImageData(data2, width, 1);
                ctx.putImageData(imageData, 0, row);
            }
        }
        return canvas.toDataURL('image/png');
    }
});
