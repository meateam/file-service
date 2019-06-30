// package: file
// file: file.proto

var file_pb = require("./file_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var FileService = (function () {
  function FileService() {}
  FileService.serviceName = "file.FileService";
  return FileService;
}());

FileService.GenerateKey = {
  methodName: "GenerateKey",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GenerateKeyRequest,
  responseType: file_pb.KeyResponse
};

FileService.CreateUpload = {
  methodName: "CreateUpload",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.CreateUploadRequest,
  responseType: file_pb.CreateUploadResponse
};

FileService.UpdateUploadID = {
  methodName: "UpdateUploadID",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.UpdateUploadIDRequest,
  responseType: file_pb.UpdateUploadIDResponse
};

FileService.GetUploadByID = {
  methodName: "GetUploadByID",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GetUploadByIDRequest,
  responseType: file_pb.GetUploadByIDResponse
};

FileService.DeleteUploadByID = {
  methodName: "DeleteUploadByID",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.DeleteUploadByIDRequest,
  responseType: file_pb.DeleteUploadByIDResponse
};

FileService.GetFileByID = {
  methodName: "GetFileByID",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GetByFileByIDRequest,
  responseType: file_pb.File
};

FileService.GetFileByKey = {
  methodName: "GetFileByKey",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GetFileByKeyRequest,
  responseType: file_pb.File
};

FileService.GetFilesByFolder = {
  methodName: "GetFilesByFolder",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GetFilesByFolderRequest,
  responseType: file_pb.GetFilesByFolderResponse
};

FileService.CreateFile = {
  methodName: "CreateFile",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.CreateFileRequest,
  responseType: file_pb.File
};

FileService.DeleteFile = {
  methodName: "DeleteFile",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.DeleteFileRequest,
  responseType: file_pb.DeleteFileResponse
};

FileService.UpdateFile = {
  methodName: "UpdateFile",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.UpdateFileRequest,
  responseType: file_pb.File
};

FileService.IsAllowed = {
  methodName: "IsAllowed",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.IsAllowedRequest,
  responseType: file_pb.IsAllowedResponse
};

FileService.GetOwnerQuota = {
  methodName: "GetOwnerQuota",
  service: FileService,
  requestStream: false,
  responseStream: false,
  requestType: file_pb.GetOwnerQuotaRequest,
  responseType: file_pb.GetOwnerQuotaResponse
};

exports.FileService = FileService;

function FileServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

FileServiceClient.prototype.generateKey = function generateKey(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GenerateKey, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.createUpload = function createUpload(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.CreateUpload, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.updateUploadID = function updateUploadID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.UpdateUploadID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.getUploadByID = function getUploadByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GetUploadByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.deleteUploadByID = function deleteUploadByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.DeleteUploadByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.getFileByID = function getFileByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GetFileByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.getFileByKey = function getFileByKey(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GetFileByKey, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.getFilesByFolder = function getFilesByFolder(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GetFilesByFolder, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.createFile = function createFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.CreateFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.deleteFile = function deleteFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.DeleteFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.updateFile = function updateFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.UpdateFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.isAllowed = function isAllowed(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.IsAllowed, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

FileServiceClient.prototype.getOwnerQuota = function getOwnerQuota(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(FileService.GetOwnerQuota, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.FileServiceClient = FileServiceClient;

