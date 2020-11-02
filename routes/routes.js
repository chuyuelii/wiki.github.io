var express = require('express');


var controller = require('../controllers/controllers');
var signIn = require('../controllers/identity');
var router = express.Router();

router.get('/',signIn.showLoginForm);
router.get('/signUp',signIn.showSignUpForm);
router.post('/signUpSubmit',signIn.submitRegisterForm);
router.post('/loginSubmit',signIn.submitLoginForm);
router.post('/logout',signIn.logOut);
router.get('/restPassword',signIn.showResetForm);
router.post('/passwordSubmit',signIn.changePassword);
router.post('/submitNewPassword',signIn.submitNewPassword);
router.get('/main',controller.showForm);
router.get('/main/revisionNumber', controller.showRevisionNumber);
router.get('/main/groupSize', controller.showGroupSize);
router.get('/main/historyDuration',controller.showHistoryDuration);
router.get('/main/drawBarGraph',controller.showGraph);
router.get('/main/drawPieGraph',controller.showPieGraph);

// Individual
router.get('/main/individual',controller.individualFunction)
router.get('/main/individualConfiguration',controller.individualConfiguration)
router.get('/main/individualGetNewsReddit',controller.individualGetNewsReddit)
router.get('/main/individualGetNewRevisions',controller.individualGetNewRevisions)
router.get('/main/individualGetLastTimestamp',controller.individualGetLastTimestamp)
router.get('/main/individualGetTopFiveUsers',controller.individualGetTopFiveUsers)
router.get('/main/individualGetTotalRevisionNumber',controller.individualGetTotalRevisionNumber)
router.get('/main/individualBarChart',controller.individualBarChart)
router.get('/main/individualPieChart',controller.individualPieChart)
router.get('/main/individualBarChart3',controller.individualBarChart3)

// Author
router.get('/main/AuthorGetList',controller.AuthorGetList);
router.get('/main/AuthorGetArticle',controller.AuthorGetArticle);
router.get('/main/AuthorGetArticleAndTitle',controller.AuthorGetArticleAndTitle);


module.exports = router;