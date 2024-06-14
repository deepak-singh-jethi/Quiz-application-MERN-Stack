import React, { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/ui/Loading";
import ErrorBlock from "../../components/ui/ErrorBlock";
import { AuthContext } from "../../context/AuthContext";
import { authorizedFetcher } from "../http";

const withDataFetching = (
  WrappedComponent,
  { URL, queryKey, additionalProps = {} }
) => {
  return (props) => {
    const { token } = useContext(AuthContext);

    // Unconditionally call hooks
    const { data, isLoading, isError, error } = useQuery({
      queryKey: queryKey,
      queryFn: ({ signal }) => authorizedFetcher({ signal, URL, token }),
      staleTime: 12000,
      cacheTime: 12000,
    });

    // Handle the side effect of setting the hasNextPage state
    useEffect(() => {
      if (data && additionalProps.setHasNextPage) {
        additionalProps.setHasNextPage(data.hasNextPage);
      }
    }, [data, additionalProps]);

    if (isLoading) return <Loading />;

    if (isError) return <ErrorBlock message={error.message} />;

    // Pass the data and other props to the wrapped component
    return <WrappedComponent data={data} {...props} {...additionalProps} />;
  };
};

export default withDataFetching;
