import axios from "axios";
import type {
  FavouriteDocument,
  FavouriteFolder,
} from "../types/favourites.types";
import apiClient from "config/axios.config";

export interface ShareDocumentPayload {
  sharedWithUserId: string;
  permission: "VIEW" | "EDIT" | "DOWNLOAD";
}

export const documentShareService = {
  async shareDocument(documentId: string, payload: ShareDocumentPayload) {
    const { data } = await apiClient.post(
      `/document-share/${documentId}/share`,
      payload,
    );

    return data;
  },
};
