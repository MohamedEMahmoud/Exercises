import { Listener, Subjects, UserCreatedEvent } from "@jogging/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { User } from "../../models/user.model";
export class UserCreatedListener extends Listener<UserCreatedEvent> {
    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserCreatedEvent["data"], msg: Message) {

        const user = User.build({
            id: data.id,
            email: data.email,
            role: data.role,
            picture: data.picture,
            coachId: data.coachId,
            version: data.version

        });

        await user.save();

        msg.ack();
    }
}