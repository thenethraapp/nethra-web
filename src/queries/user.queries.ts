import { nextError } from "@/api/core/apiClient";
import axios from "axios";

export const getUserIP = async () => {
	const { data } = await axios
		.get("https://ipinfo.io/json")
		.catch(e => nextError(e));
	return data;
};