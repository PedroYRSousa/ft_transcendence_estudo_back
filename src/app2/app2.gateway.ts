import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const connections = new Map<string, Socket>();

interface Payload {
  name: string;
  text: string;
}

@WebSocketGateway(3335, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class App2Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('Game');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: Payload): void {
    this.logger.log(`Client ${client.id} enviou dados ${payload.text}`);

    this.broadcast(null, payload);
  }

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connect ${client.id}`);

    connections.set(client.id, client);
    this.broadcast(client, {
      name: 'System',
      text: `${client.id} entrou no chat`,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnect ${client.id}`);

    connections.delete(client.id);
    this.broadcast(client, {
      name: 'System',
      text: `${client.id} saiu no chat`,
    });
  }

  sendMessage(client: Socket, payload: Payload) {
    this.logger.log(`Enviando dados ${payload.text} para ${client.id}`);
    client.emit('msgToClient', payload, client.id);
  }

  broadcast(clientOwner: Socket | null, payload: Payload) {
    connections.forEach((client, refer) => {
      if (clientOwner && clientOwner.id == refer) return;

      this.sendMessage(client, payload);
    });
  }
}
