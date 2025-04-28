declare namespace Chrome {
  export namespace system {
    export namespace cpu {
      export function getInfo(): Promise<{
        numOfProcessors: number;
        archName: string;
        modelName: string;
        features: string[];
        processors: Array<{
          usage: {
            user: number;
            kernel: number;
            idle: number;
            total: number;
          };
        }>;
      }>;
    }
    export namespace memory {
      export function getInfo(): Promise<{
        capacity: number;
        availableCapacity: number;
      }>;
    }
    export namespace storage {
      export function getInfo(): Promise<{
        id: string;
        name: string;
        type: string;
        capacity: number;
      }[]>;
    }
    export namespace display {
      export function getInfo(): Promise<{
        id: string;
        name: string;
        bounds: { left: number; top: number; width: number; height: number };
        workArea: { left: number; top: number; width: number; height: number };
        isPrimary: boolean;
        isInternal: boolean;
        isEnabled: boolean;
        dpiX: number;
        dpiY: number;
        rotation: number;
      }[]>;
    }
  }

  export namespace processes {
    export function getProcessInfo(processIds: number[]): Promise<{
      [key: number]: {
        type: string;
        cpu: number;
        network: number;
        privateMemory: number;
        jsMemoryAllocated: number;
        jsMemoryUsed: number;
      };
    }>;
  }
}
