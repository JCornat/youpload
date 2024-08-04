import { EntityId } from "../../shared/domain/model/entity-id.ts";
import {Entity} from "../../shared/domain/model/entity.ts";
import { ArgumentInvalidException } from "../../shared/lib/exceptions.ts";

export interface TemporaryFileProps {
    id: EntityId;
    name?: string;
}

export class TemporaryFile extends Entity {
    private constructor(
        id: EntityId,
        private readonly _name: string
    ) {
        super(id);
    }

    static create(props: TemporaryFileProps): TemporaryFile {
        if (!props.name) {
            throw new ArgumentInvalidException('Value cannot be empty');
        }

        return new TemporaryFile(props.id, props.name);
    }

    get name() {
        return this._name;
    }
}
