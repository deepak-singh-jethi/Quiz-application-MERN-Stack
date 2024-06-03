// withDataFetching.js
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Shared/Loading";
import ErrorBlock from "../../components/Shared/ErrorBlock";
import { AuthContext } from "../../context/AuthContext";
import { authorizedFetcher } from "../http";

const withDataFetching = (WrappedComponent, { URL, queryKey }) => {
  return (props) => {
    const { token } = useContext(AuthContext);

    const { data, isLoading, isError, error } = useQuery({
      queryKey: queryKey,
      queryFn: ({ signal }) => authorizedFetcher({ signal, URL, token }),
    });

    if (isLoading) return <Loading />;

    if (isError) return <ErrorBlock message={error.message} />;

    // Pass the data and other props to the wrapped component
    return <WrappedComponent data={data} {...props} />;
  };
};

export default withDataFetching;
