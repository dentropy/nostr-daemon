--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: notify_nostr_event(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_nostr_event() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF OLD.id IS DISTINCT FROM NEW.id THEN
            PERFORM pg_notify('nostr_event', NEW.id::text);
        END IF;

        RETURN NEW;
    END;
    $$;


ALTER FUNCTION public.notify_nostr_event() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_tokens (
    token_hash bytea NOT NULL,
    pubkey character(64) NOT NULL,
    nip46_sk_enc bytea NOT NULL,
    nip46_relays jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bunker_pubkey character(64) NOT NULL
);


ALTER TABLE public.auth_tokens OWNER TO postgres;

--
-- Name: author_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.author_stats (
    pubkey character(64) NOT NULL,
    followers_count integer DEFAULT 0 NOT NULL,
    following_count integer DEFAULT 0 NOT NULL,
    notes_count integer DEFAULT 0 NOT NULL,
    search text DEFAULT ''::text NOT NULL,
    streak_start integer,
    streak_end integer,
    nip05 character varying(320),
    nip05_domain character varying(253),
    nip05_hostname character varying(253),
    nip05_last_verified_at integer,
    CONSTRAINT author_stats_nip05_domain_lowercase_chk CHECK (((nip05_domain)::text = lower((nip05_domain)::text))),
    CONSTRAINT author_stats_nip05_hostname_domain_chk CHECK (((nip05_hostname)::text ~~ ('%'::text || (nip05_domain)::text))),
    CONSTRAINT author_stats_nip05_hostname_lowercase_chk CHECK (((nip05_hostname)::text = lower((nip05_hostname)::text)))
);


ALTER TABLE public.author_stats OWNER TO postgres;

--
-- Name: domain_favicons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.domain_favicons (
    domain character varying(253) NOT NULL,
    favicon character varying(2048) NOT NULL,
    last_updated_at integer NOT NULL,
    CONSTRAINT domain_favicons_https_chk CHECK (((favicon)::text ~* '^https:\/\/'::text))
);


ALTER TABLE public.domain_favicons OWNER TO postgres;

--
-- Name: event_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_stats (
    event_id character(64) NOT NULL,
    replies_count integer DEFAULT 0 NOT NULL,
    reposts_count integer DEFAULT 0 NOT NULL,
    reactions_count integer DEFAULT 0 NOT NULL,
    reactions text DEFAULT '{}'::text,
    quotes_count integer DEFAULT 0 NOT NULL,
    zaps_amount integer DEFAULT 0 NOT NULL,
    link_preview jsonb,
    zaps_amount_cashu integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.event_stats OWNER TO postgres;

--
-- Name: event_zaps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_zaps (
    receipt_id text NOT NULL,
    target_event_id text NOT NULL,
    sender_pubkey text NOT NULL,
    amount_millisats integer NOT NULL,
    comment text NOT NULL
);


ALTER TABLE public.event_zaps OWNER TO postgres;

--
-- Name: kysely_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration (
    name character varying(255) NOT NULL,
    "timestamp" character varying(255) NOT NULL
);


ALTER TABLE public.kysely_migration OWNER TO postgres;

--
-- Name: kysely_migration_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration_lock (
    id character varying(255) NOT NULL,
    is_locked integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.kysely_migration_lock OWNER TO postgres;

--
-- Name: nostr_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nostr_events (
    id character(64) NOT NULL,
    kind integer NOT NULL,
    pubkey character(64) NOT NULL,
    content text NOT NULL,
    created_at bigint NOT NULL,
    tags jsonb NOT NULL,
    tags_index jsonb NOT NULL,
    sig character(128) NOT NULL,
    d text,
    search tsvector,
    search_ext jsonb NOT NULL,
    CONSTRAINT nostr_events_created_chk CHECK ((created_at >= 0)),
    CONSTRAINT nostr_events_d_chk CHECK ((((kind >= 30000) AND (kind < 40000) AND (d IS NOT NULL)) OR (((kind < 30000) OR (kind >= 40000)) AND (d IS NULL)))),
    CONSTRAINT nostr_events_kind_chk CHECK ((kind >= 0)),
    CONSTRAINT nostr_events_search_ext_chk CHECK ((jsonb_typeof(search_ext) = 'object'::text))
);


ALTER TABLE public.nostr_events OWNER TO postgres;

--
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.push_subscriptions (
    id bigint NOT NULL,
    pubkey character(64) NOT NULL,
    token_hash bytea NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.push_subscriptions OWNER TO postgres;

--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_subscriptions_id_seq OWNER TO postgres;

--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- Name: top_authors; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.top_authors AS
 SELECT pubkey,
    followers_count,
    search
   FROM public.author_stats
  ORDER BY followers_count DESC
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.top_authors OWNER TO postgres;

--
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- Name: auth_tokens auth_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_tokens
    ADD CONSTRAINT auth_tokens_pkey PRIMARY KEY (token_hash);


--
-- Name: author_stats author_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.author_stats
    ADD CONSTRAINT author_stats_pkey PRIMARY KEY (pubkey);


--
-- Name: domain_favicons domain_favicons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.domain_favicons
    ADD CONSTRAINT domain_favicons_pkey PRIMARY KEY (domain);


--
-- Name: event_stats event_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_stats
    ADD CONSTRAINT event_stats_pkey PRIMARY KEY (event_id);


--
-- Name: event_zaps event_zaps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_zaps
    ADD CONSTRAINT event_zaps_pkey PRIMARY KEY (receipt_id);


--
-- Name: kysely_migration_lock kysely_migration_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration_lock
    ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration kysely_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration
    ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);


--
-- Name: nostr_events nostr_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nostr_events
    ADD CONSTRAINT nostr_events_pkey PRIMARY KEY (id);


--
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: author_stats_followers_count_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX author_stats_followers_count_idx ON public.author_stats USING btree (followers_count DESC);


--
-- Name: author_stats_nip05_domain_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX author_stats_nip05_domain_idx ON public.author_stats USING btree (nip05_domain);


--
-- Name: author_stats_nip05_hostname_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX author_stats_nip05_hostname_idx ON public.author_stats USING btree (nip05_hostname);


--
-- Name: idx_event_stats_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_stats_event_id ON public.event_stats USING btree (event_id);


--
-- Name: idx_event_zaps_amount_millisats; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_zaps_amount_millisats ON public.event_zaps USING btree (amount_millisats);


--
-- Name: idx_event_zaps_target_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_zaps_target_event_id ON public.event_zaps USING btree (target_event_id);


--
-- Name: nostr_events_created_kind_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nostr_events_created_kind_idx ON public.nostr_events USING btree (created_at DESC, id, kind, pubkey);


--
-- Name: nostr_events_parameterized_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX nostr_events_parameterized_idx ON public.nostr_events USING btree (kind, pubkey, d) WHERE ((kind >= 30000) AND (kind < 40000));


--
-- Name: nostr_events_pubkey_created_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nostr_events_pubkey_created_idx ON public.nostr_events USING btree (pubkey, created_at DESC, id, kind);


--
-- Name: nostr_events_replaceable_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX nostr_events_replaceable_idx ON public.nostr_events USING btree (kind, pubkey) WHERE (((kind >= 10000) AND (kind < 20000)) OR (kind = ANY (ARRAY[0, 3])));


--
-- Name: nostr_events_search_ext_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nostr_events_search_ext_idx ON public.nostr_events USING gin (search_ext);


--
-- Name: nostr_events_search_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nostr_events_search_idx ON public.nostr_events USING gin (search);


--
-- Name: nostr_events_tags_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX nostr_events_tags_idx ON public.nostr_events USING gin (tags_index);


--
-- Name: push_subscriptions_token_hash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX push_subscriptions_token_hash_idx ON public.push_subscriptions USING btree (token_hash);


--
-- Name: top_authors_pubkey_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX top_authors_pubkey_idx ON public.top_authors USING btree (pubkey);


--
-- Name: top_authors_search_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX top_authors_search_idx ON public.top_authors USING gin (search public.gin_trgm_ops);


--
-- Name: nostr_events nostr_event_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER nostr_event_trigger AFTER INSERT OR UPDATE ON public.nostr_events FOR EACH ROW EXECUTE FUNCTION public.notify_nostr_event();


--
-- Name: push_subscriptions push_subscriptions_token_hash_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_token_hash_fkey FOREIGN KEY (token_hash) REFERENCES public.auth_tokens(token_hash) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

