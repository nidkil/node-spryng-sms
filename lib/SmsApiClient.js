'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SmsApiClient = function () {
  function SmsApiClient(_ref) {
    var _ref$baseUrl = _ref.baseUrl,
        baseUrl = _ref$baseUrl === undefined ? 'https://api.spryngsms.com/api' : _ref$baseUrl,
        username = _ref.username,
        password = _ref.password;

    _classCallCheck(this, SmsApiClient);

    if (username === null || username === undefined) {
      throw new _errors.ArgumentError('Must provide a username for the SMS Gateway API');
    }
    if ('string' !== typeof username || username.length === 0) {
      throw new _errors.ArgumentError('The provided username is invalid');
    }
    if (password === null || password === undefined) {
      throw new _errors.ArgumentError('Must provide a password for the SMS Gateway API');
    }
    if ('string' !== typeof password || password.length === 0) {
      throw new _errors.ArgumentError('The provided password is invalid');
    }

    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
  }

  _createClass(SmsApiClient, [{
    key: 'getSendError',
    value: function getSendError(body) {
      switch (body) {
        case '100':
          return new _errors.ApiError('missing_parameter', 'Missing Parameter for the Send operation');
        case '101':
          return new _errors.ApiError('username_too_short', 'Username too short');
        case '102':
          return new _errors.ApiError('username_too_long', 'Username too long');
        case '103':
          return new _errors.ApiError('password_too_short', 'Password too short');
        case '104':
          return new _errors.ApiError('password_too_long', 'Password too long');
        case '105':
          return new _errors.ApiError('destination_too_short', 'Destination too short');
        case '106':
          return new _errors.ApiError('destination_too_long', 'Destination too long');
        case '108':
          return new _errors.ApiError('sender_too_short', 'Sender too short');
        case '107':
          return new _errors.ApiError('sender_too_long', 'Sender too long');
        case '109':
          return new _errors.ApiError('body_too_short', 'Body too short');
        case '110':
          return new _errors.ApiError('body_too_long', 'Body too long');
        case '200':
          return new _errors.ApiError('security_error', 'Security Error');
        case '201':
          return new _errors.ApiError('unknown_route', 'Unknown Route');
        case '202':
          return new _errors.ApiError('route_access_violation', 'Route Access Violation');
        case '203':
          return new _errors.ApiError('insufficient_credits', 'Insufficient Credits');
        case '800':
          return new _errors.ApiError('technical_error', 'Technical Error');
        default:
          return null;
      }
    }
  }, {
    key: 'validateSendRequest',
    value: function validateSendRequest(request) {
      if (request === null || request === undefined) {
        return new _errors.ValidationError('request_required', 'A request object needs to be provided');
      }
      if (request.destination === null || request.destination === undefined) {
        return new _errors.ValidationError('destination_required', 'Missing Destination for the Send operation');
      }
      if (request.route === null || request.route === undefined) {
        return new _errors.ValidationError('route_required', 'Missing Route for the Send operation');
      }
      if (request.body === null || request.body === undefined) {
        return new _errors.ValidationError('body_required', 'Missing Body for the Send operation');
      }
      if (request.sender === null || request.sender === undefined) {
        return new _errors.ValidationError('sender_required', 'Missing Sender for the Send operation');
      }
    }
  }, {
    key: 'send',
    value: function send(request) {
      var _this = this;

      var validationError = this.validateSendRequest(request);
      if (validationError) {
        return _bluebird2.default.reject(validationError);
      }

      var options = {
        method: 'POST',
        uri: this.baseUrl + '/send.php',
        form: {
          OPERATION: 'send',
          USERNAME: this.username,
          PASSWORD: this.password,
          DESTINATION: Array.isArray(request.destination) ? request.destination.join(', ') : request.destination,
          ROUTE: request.route,
          ALLOWLONG: request.allowLong ? 1 : 0,
          BODY: request.body,
          SENDER: request.sender,
          REFERENCE: request.reference
        }
      };

      return (0, _requestPromise2.default)(options).then(function (body) {
        var sendError = _this.getSendError(body);
        if (sendError) {
          return _bluebird2.default.reject(sendError);
        }
      });
    }
  }, {
    key: 'getRemainingCredit',
    value: function getRemainingCredit() {
      var options = {
        method: 'GET',
        uri: this.baseUrl + '/check.php',
        qs: {
          USERNAME: this.username,
          PASSWORD: this.password
        }
      };

      return (0, _requestPromise2.default)(options).then(function (body) {
        if (!body || body === '-1') {
          return _bluebird2.default.reject(new _errors.ApiError('credit_check_error', 'Unknown error while trying to retrieve credit status'));
        }

        var credit = parseFloat(body);
        if (Number.isNaN(credit)) {
          return _bluebird2.default.reject(new _errors.ApiError('credit_check_error', 'Unable to parse credit details: ' + credit));
        }

        return credit;
      });
    }
  }]);

  return SmsApiClient;
}();

exports.default = SmsApiClient;