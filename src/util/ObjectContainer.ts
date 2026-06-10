/**
 * Generic container that stores objects and reuses deleted IDs
 * to optimize memory and avoid array fragmentation.
 */
export class ObjectContainer<T> {
    #objects: (T | null)[] = [];
    #deleted: number[] = [];
    #count = 0;

    /**
     * Adds an object to the container.
     * @returns The ID assigned to the object (reuses IDs from previous deletions).
     */
    add(obj: T): number {
        let id: number;
        if (this.#deleted.length > 0) {
            id = this.#deleted.pop()!;
            this.#objects[id] = obj;
        } else {
            id = this.#objects.push(obj) - 1;
        }
        this.#count++;
        return id;
    }

    /**
     * Removes the object with the given ID.
     * The ID becomes available for reuse on the next `add()`.
     */
    del(id: number): void {
        if (this.#objects[id] != null) {
            this.#objects[id] = null;
            this.#deleted.push(id);
            this.#count--;
            if (this.#count === 0) {
                this.#deleted = [];
                this.#objects = [];
            }
        }
    }

    /**
     * Returns the object at the given ID, or `null` if the ID has been deleted.
     */
    getObject(id: number): T | null {
        return this.#objects[id];
    }

    /**
     * Returns the internal array of all objects (may contain `null` holes).
     */
    getAll(): (T | null)[] {
        return this.#objects;
    }

    /**
     * Returns the number of active (non-deleted) objects.
     */
    getCount(): number {
        return this.#count;
    }

    /**
     * Compacts the container by removing all `null` entries.
     * Useful after many deletions to reduce iteration overhead.
     */
    clean(): void {
        this.#objects = this.#objects.filter(t => t != null);
        this.#deleted = [];
    }

    /**
     * Removes all objects and resets the container.
     */
    reset(): void {
        this.#objects = [];
        this.#deleted = [];
        this.#count = 0;
    }

    /**
     * Prints debug info to the console.
     */
    debug(): void {
        console.info("---- OBJECTCONTAINER DEBUG ----");
        console.log("DELETED: " + this.#deleted);
        console.log("OBJECTS: " + this.#objects);
        console.log("COUNT  : " + this.#count);
        console.log("-------------------------------");
    }
}
