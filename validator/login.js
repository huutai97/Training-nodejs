module.exports = {
    validator: (req)   =>  {
        req.checkBody('username',   "Dân chơi đăng nhập sai nhiều lần sẽ bị block 24h").isLength({min: 4,max: 20});
    }
}


