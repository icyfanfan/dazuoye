module.exports = {

  "GET /report/getQaData/": function(req, res, next){

    res.send(JSON.stringify({"qa1":[{"status":"3","content":""},{"status":"2","content":""},
            {"status":"1","content":""}],"qa2":[{"status":"2","content":""},
            {"status":"1","content":""}],"qa3":[],"qa4":[],"qa5":[],"qa6":[]}));

  },
  // 
  // 不带查询参数，返回上一次数据
  // 带参数查询，参数格式：，返回查询数据
  "GET /report/getReportData/:id": function(req, res, next){
    var startTime = new Date().getTime(); 
   while (new Date().getTime() < startTime + 5000);
    res.send(JSON.stringify({"QA提交BUG情况":{"keys":["name1","name2"],"values":[10,20]},"category2":{"keys":["name1","name2"],"values":[10,20]}}));

  },
  "GET /report/getReportData/": function(req, res, next){
    
    res.send(JSON.stringify({"QA提交BUG情况":{"keys":["name1","name2"],"values":[10,20],"time":"2015-12-12 00:12,2015-12-12 00:12"},"category2":{"keys":["name1","name2"],"values":[10,20],"time":",今"}}));

  },
  "POST /report/saveQaData/": function(req, res, next){
    
    res.send({"suc":true,"msg":""});
  },

}          