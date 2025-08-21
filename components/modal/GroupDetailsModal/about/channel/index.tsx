import { useSettingModal } from "@/contexts/modal-setting";
import useGroup from "@/hooks/userGroup";
import { GroupType } from "@/types/groups";

const ChannelAbout = ({
  channel,
}: {
  group: GroupType | undefined;
  channel:
    | {
        type: string;
        id: string;
        name: string;
        privacy: "PUBLIC" | "PRIVATE";
        createdAt: Date;
        updatedAt: Date;
        access: boolean;
        role: Array<{
          permissions: Array<"VIEW" | "CHAT" | "ADMIN">;
        }>;
        request: {
          id: string;
          status: string;
        } | null;
        description?: string | null;
        topic?: string | null;
        canDelete?: boolean;
      }
    | undefined;
}) => {
  const { toggleModal, modalData } = useSettingModal();
  const { isChannelAdmin } = useGroup();

  const canEdit = channel?.access && isChannelAdmin;

  return (
    <div className=" rounded-lg p-4 space-y-4 bg-white">
      {/* Name */}
      <div className="border rounded-md p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm">Name</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {channel?.name || "general"}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                type: "name",
                previous: {
                  name: "groupDetailsModal",
                  data: modalData?.groupDetailsModal,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* Topic */}
      <div className="border rounded-md p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm">Topic</h2>
          <p className="text-gray-500 mt-1 text-sm">
            {channel?.topic
              ? channel?.topic
              : canEdit
              ? "Add topic"
              : "No channel topic"}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                type: "topic",
                previous: {
                  name: "groupDetailsModal",
                  data: modalData?.groupDetailsModal,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>

      {/* Description */}
      <div className="border rounded-md p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold  text-sm">Description</h2>
          <button>
            <p className="text-gray-500 mt-1 text-sm">
              {channel?.description
                ? channel?.description
                : canEdit
                ? "Add description"
                : "No channel description"}
            </p>
          </button>
        </div>

        {canEdit && (
          <button
            onClick={() =>
              toggleModal("channelAboutModal", {
                ...modalData,
                type: "description",
                previous: {
                  name: "groupDetailsModal",
                  data: modalData?.groupDetailsModal,
                },
              })
            }
            className="text-primary font-semibold text-sm"
          >
            Edit
          </button>
        )}
      </div>
      {!isChannelAdmin && (
        <button className=" text-start w-full py-3   px-2 border rounded-md">
          <p className="text-[14px] font-Inter ml-2 text-red-600">
            Leave channel
          </p>
        </button>
      )}
    </div>
  );
};

export default ChannelAbout;
