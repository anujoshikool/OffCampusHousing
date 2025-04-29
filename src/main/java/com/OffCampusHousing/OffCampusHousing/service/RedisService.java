package com.OffCampusHousing.OffCampusHousing.service;

import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.Pipeline;

@Service
public class RedisService {
	
	// private final RedisTemplate<String, String> redisTemplate;
	

    // public RedisService(RedisTemplate<String, String> redisTemplate) {
    //     this.redisTemplate = redisTemplate;
    // }

//    private final Jedis jedis;	
//
//    public RedisService(Jedis jedis) {
//        this.jedis = jedis;
//    }
	
	 private final JedisPool jedisPool;

	    public RedisService(JedisPool jedisPool) {
	        this.jedisPool = jedisPool;
	    }

    // Store tabId and JWT Token in Redis
    public void storeToken(String tabId, String jwtToken, long expirationTime) {
        //redisTemplate.opsForValue().set(tabId, jwtToken, expirationTime, TimeUnit.MINUTES);
       // jedis.setex(tabId, expirationTime * 60, jwtToken);
    	 try (Jedis jedis = jedisPool.getResource()) {
             jedis.setex(tabId, expirationTime * 60, jwtToken);
         }
    }

    // Retrieve JWT Token using tabId
    public String getToken(String tabId) {
        //return redisTemplate.opsForValue().get(tabId);
        //return jedisPool.get(tabId);
    	  try (Jedis jedis = jedisPool.getResource()) {
              return jedis.get(tabId);
          }
    }

    // Delete JWT Token when user logs out
    public void deleteToken(String tabId) {
        //redisTemplate.delete(tabId);
       // jedis.del(tabId);
    	 try (Jedis jedis = jedisPool.getResource()) {
             jedis.del(tabId);
         }
    }
    
    
    public Jedis getJedisResource() {
        return jedisPool.getResource();
    }
    
    
    public boolean allowAction(String key, int limit, int seconds) {
        try (Jedis jedis = jedisPool.getResource()) {
            // 1. Check current count using single GET
            String current = jedis.get(key);
            if (current != null && Integer.parseInt(current) >= limit) {
                return false;
            }

            // 2. Use pipeline for atomic INCR + EXPIRE
            Pipeline pipeline = jedis.pipelined();
            pipeline.incr(key);
            pipeline.expire(key, seconds);
            pipeline.sync(); // Execute all commands atomically
            
            return true;
        }
    }
}

