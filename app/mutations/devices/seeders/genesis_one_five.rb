module Devices
  module Seeders
    class GenesisOneFive < AbstractGenesis
      def settings_firmware
        device
          .fbos_config
          .update!(firmware_hardware: FbosConfig::FARMDUINO_K15)
      end

      def tool_slots_slot_7
        add_tool_slot(name: ToolNames::SEED_TROUGH_1,
                      x: 0,
                      y: 25,
                      z: 0,
                      tool: tools_seed_trough_1,
                      pullout_direction: ToolSlot::NONE,
                      gantry_mounted: true)
      end

      def tool_slots_slot_8
        add_tool_slot(name: ToolNames::SEED_TROUGH_2,
                      x: 0,
                      y: 50,
                      z: 0,
                      tool: tools_seed_trough_2,
                      pullout_direction: ToolSlot::NONE,
                      gantry_mounted: true)
      end

      def tools_seed_trough_1
        @tools_seed_trough_1 ||=
          add_tool(ToolNames::SEED_TROUGH_1)
      end

      def tools_seed_trough_2
        @tools_seed_trough_2 ||=
          add_tool(ToolNames::SEED_TROUGH_2)
      end
    end
  end
end
