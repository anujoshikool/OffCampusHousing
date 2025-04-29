package com.OffCampusHousing.OffCampusHousing.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private int redisPort;

    @Value("${spring.redis.password:}")
    private String redisPassword;

    @Value("${spring.redis.ssl:false}")
    private boolean redisSsl;

    @Bean
    public JedisPool jedisPool() {
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(20); // Set max connections in pool
        poolConfig.setMaxIdle(10);
        poolConfig.setMinIdle(2);
        poolConfig.setTestOnBorrow(true); // Ensures valid connection

        if (redisPassword != null && !redisPassword.isEmpty()) {
            return new JedisPool(poolConfig, redisHost, redisPort, 2000, redisPassword, redisSsl);
        } else {
            return new JedisPool(poolConfig, redisHost, redisPort, 2000, null, redisSsl);
        }
    }
}
//public class RedisConfig {
//
//	@Value("${spring.redis.host}")
//	private String redisHost;
//
//	@Value("${spring.redis.port}")
//	private int redisPort;
//
//	@Value("${spring.redis.password:}") // Default to empty if not provided
//	private String redisPassword;
//
//	@Value("${spring.redis.username:}") // Default to empty if not provided
//	private String redisUsername;
//
//	@Value("${spring.redis.ssl:false}") // Default to false if not provided
//	private boolean redisSsl;
//
//	@Bean
//	public Jedis jedis() {
//		System.out.println(redisHost+":"+redisPort+":"+redisSsl+":"+"BYE!!!");
//		Jedis jedis = new Jedis(redisHost, redisPort, redisSsl);
//		jedis.auth(redisPassword);
//		return jedis;
//	}
//
//
//}



