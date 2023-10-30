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

@WebSocketGateway(3334, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //@SubscribeMessage('msgToServer')
  //handleMessage(client: unknown, payload: unknown): string {
  //  console.dir(client);
  //  console.dir(payload);
  //  return 'Hello world!';
  //}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    console.dir(client);
    console.dir(payload);
    this.server.emit('msgToClient', payload, client.id);
  }

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(client: Socket) {
    console.dir(client);
    this.logger.log(`Client connect ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.dir(client);
    this.logger.log(`Client disconnect ${client.id}`);
  }
}
