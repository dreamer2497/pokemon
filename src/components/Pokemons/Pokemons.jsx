/** @jsxRuntime classic */
/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { css, jsx, keyframes } from "@emotion/react";
import { useQuery, gql } from "@apollo/client";
import { Pagination } from "antd";
import "antd/dist/antd.css";

import Loading from "../Loading/Loading";
import PokemonCards from "./PokemonCard";

const Pokemons = (props) => {
    const cssBreakpoint = [320, 425, 768, 1024, 1440];
    const mqx = cssBreakpoint.map((bp) => `@media (max-width: ${bp}px)`); //mediaquery max

    let [offset, setOffset] = useState(0);
    let [currPage, setPage] = useState(1);

    let pokemonsCss = {
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "10%",
        width: "100%",
        height: "100%",
        userSelect: "none",
        backgroundColor: "#E4EBE0",
    };

    let iconCss = {
        width: "25vw",
        zIndex: 3,
        [mqx[2]]: {
            width: "50vw",
        },
    };

    let pokemonListCss = {
        marginTop: "2.5%",
        display: "flex",
        width: "50%",
        flexWrap: "wrap",
        flexDirection: "row",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        [mqx[2]]: {
            width: "100%",
            marginTop: "5%",
        },
    };

    let paginationCss = {
        marginTop: "5%",
        marginBottom: "5vh",
    };

    const onPaginationChanged = (page, pageSize) => {
        setOffset(32 * (page - 1));
        setPage(page);
    };

    const GET_POKEMONS = gql`
        query pokemons($limit: Int, $offset: Int) {
            pokemons(limit: $limit, offset: $offset) {
                count
                next
                previous
                status
                message
                results {
                    url
                    name
                    image
                }
            }
        }
    `;

    const gqlVariables = {
        limit: 32,
        offset: offset,
    };

    const { loading, error, data } = useQuery(GET_POKEMONS, {
        variables: gqlVariables,
    });

    if (loading)
        return (
            <div css={pokemonsCss}>
                <img css={iconCss} src="/asset/pokemon_icon.png" />
                <Loading />
            </div>
        );

    if (error)
        return <div css={pokemonsCss}>Somethings wrong, please try again</div>;

    return (
        <div css={pokemonsCss}>
            <img css={iconCss} src="/asset/pokemon_icon.png" />

            <div css={pokemonListCss}>
                {data.pokemons.results.map((item, index) => {
                    return <PokemonCards pokemon={item} key={index} />;
                })}
            </div>

            <Pagination
                css={paginationCss}
                total={data.pokemons.count}
                current={currPage}
                showSizeChanger
                showQuickJumper
                pageSize={32}
                responsive={true}
                onChange={onPaginationChanged}
                showTotal={(total) => `Total ${total} items`}
            />
        </div>
    );
};

export default Pokemons;