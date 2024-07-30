import { useState, useEffect, memo, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";
import { baseUrl, getRequest } from "../../utils/services";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";

const ModalSearch = ({ open, onClose }) => {
  const { debounce } = useDebounce();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [errorSearchResult, setErrorSearchResult] = useState("");

  const performSearch = useCallback(async () => {
    if (search !== "") {
      setErrorSearchResult("");
      setSearchResult([]);
      try {
        const response = await getRequest(
          `${baseUrl}/users/search-users?search=${search}`
        );
        const datas = response.datas.filter(
          (data) => data.email !== user.email
        );
        if (response.success === false) {
          return setErrorSearchResult(response.msg);
        }
        return setSearchResult(datas);
      } catch (error) {
        console.log({ error });
        return null;
      }
    } else {
      setErrorSearchResult("");
      setSearchResult([]);
    }
  }, [search]);
  const debouncedSearch = debounce(performSearch, 700);
  useEffect(() => {
    debouncedSearch();
  }, [search]);

  console.log({ searchResult });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full p-4">
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="w-full mt-4">
          {errorSearchResult.length > 1 && (
            <p className="text-sm bg-rose-100 border border-rose-400 text-rose-700 p-2 rounded-sm capitalize">
              {errorSearchResult}
            </p>
          )}
          {searchResult &&
            searchResult?.map((result) => (
              <div key={result.id} className="p-2 border-b">
                <p>{result.name}</p>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

ModalSearch.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default memo(ModalSearch);
