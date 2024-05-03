const fastify = require('fastify')({ logger: true })
const amqp = require('amqplib/callback_api');

let channel = null;
const path = require('path')
const staticServe = require('@fastify/static');

const staticPath = path.join(__dirname, '/view/build')

fastify.register(staticServe, {
  root: staticPath,
  prefix: '/', // opcional: definir um prefixo para as rotas estáticas
})


// Conecta ao RabbitMQ e cria um canal
amqp.connect('amqp://localhost', (err, conn) => {
  if (err) {
    throw err;
  }

  conn.createChannel((err, ch) => {
    if (err) {
      throw err;
    }

    channel = ch;
    channel.assertQueue('my_queue');
  });
});

// Rota para gravar mensagens na fila
fastify.post('/message', async (request, reply) => {
  console.log(request.body)
  const message = request.body.message;

  channel.sendToQueue('my_queue', Buffer.from(message));

  return { status: 'ok' };
});

// Rota para ler mensagens da fila
fastify.get('/message', async (request, reply) => {
  let message = null;

  channel.consume('my_queue', (msg) => {
    message = msg.content.toString();
    channel.ack(msg);
  }, { noAck: false });

  return { message };
});

// Inicia o servidor
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
});
