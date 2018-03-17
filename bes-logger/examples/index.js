var logger = require('./../src').logger;

// Plain messages
logger.info('This is an info message');
logger.warn('This is an warning message');
logger.debug('This is for development');
logger.error('You just found an error');

// Message with object/s
var obj = { foo: 'bar' };
var newObj = { foo: 'baz' };
logger.info('Foo object:', obj);
logger.info('Foo objects:', obj, newObj);
logger.debug('Foo object:' + obj);
logger.debug('Foo object:', obj);
